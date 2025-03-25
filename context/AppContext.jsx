'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = (props) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    

    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    
    // ✅ Persist cartItems using localStorage
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("cartItems")) || {};
        }
        return {};
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const [addresses, setAddresses] = useState([]);

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/add/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'seller') {
                setIsSeller(true);
            }

            const token = await getToken();
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Fetched User Data:", data.user); // ✅ Debugging

            if (data.success) {
                setUserData(data.user);
                if (data.user.cartItems) {
                    setCartItems(data.user.cartItems);
                } else {
                    console.warn("cartItems missing in API response, setting default {}");
                    setCartItems({});
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }

    };
    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prevCartItems) => {
            const newCart = { ...prevCartItems };
    
            if (quantity <= 0) {
                delete newCart[itemId]; // Remove item if quantity is 0 or less
            } else {
                newCart[itemId] = quantity; // Update quantity
            }
    
            return newCart;
        });
    
        toast.success("Cart updated!");
    };
    

    const addToCart = async (itemId) => {
        let cartData = { ...cartItems };
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        setCartItems(cartData);
        console.log("Cart Updated:", cartData); // ✅ Debugging

        toast.success('Item added to cart');

        if (user) {
            try {
                const token = await getToken();
                await axios.get('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) {
                console.warn(`Product with ID ${itemId} not found.`);
                continue;
            }
            totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const value = {
        currency, router, getToken, addresses,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, getCartCount, getCartAmount, updateCartQuantity, user
    };
    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
