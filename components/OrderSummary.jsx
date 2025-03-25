// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const OrderSummary = () => {
//   const { currency, getToken, user, getCartCount, getCartAmount, router } = useAppContext();
//   // cartItems, setCartItems,
//   //addToCart, getCartCount, getCartAmount,
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [cartItems, setCartItems] = useState({}); // ✅ Define cartItems state

//   // Fetch Addresses from API
//   const fetchUserAddresses = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get('/api/user/data/get-address', {
//         headers: { Authorization: `Bearer ${token}` } // ✅ Fix template string
//       });

//       if (data.success) {
//         console.log("Fetched Addresses:", data.addresses);
//         setUserAddresses(data.addresses);

//         if (data.addresses.length > 0) {
//           setSelectedAddress(data.addresses[0]);
//           console.log("Selected Address:", data.addresses[0]);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses.");
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchUserAddresses();
//     }
//   }, [user]);

//   // Handle Address Selection
//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   // Create Order Function
//   // const createOrder = async () => {
//   //   try {
//   //     if (!selectedAddress) {
//   //       return toast.error("Please select an address");
//   //     }

//   //     let cartItemsArray = Object.keys(cartItems).map((key) => ({
//   //       product: key,
//   //       quantity: cartItems[key]
//   //     }));
//   //     cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);

//   //     if (cartItemsArray.length === 0) {
//   //       return toast.error("Cart is empty");
//   //     }

//   //     const token = await getToken();
//   //     const { data } = await axios.post(
//   //       "/api/order/create",
//   //       { address: selectedAddress._id, items: cartItemsArray },
//   //       { headers: { Authorization: `Bearer ${token}` } } // ✅ Fix template string
//   //     );

//   //     if (data.success) {
//   //       toast.success(data.message);
//   //       setCartItems({});
//   //       router.push("/order-placed");
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error creating order:", error);

//   //     // ✅ Fix error handling
//   //     const errorMessage =
//   //       error.response?.data?.message || "Failed to create order.";
//   //     toast.error(errorMessage);
//   //   }
//   // };
//  const createOrder = async () => {
//     try {
//         if (!selectedAddress) {
//             return toast.error("Please select an address");
//         }

//         console.log("Cart Items before filtering:", cartItems); // 🔍 Debugging

//         let cartItemsArray = Object.keys(cartItems).map((key) => ({
//             product: key,
//             quantity: cartItems[key],
//         }));

//         console.log("Cart Items Array before filtering:", cartItemsArray); // 🔍 Debugging

//         // Filter out items with quantity 0
//         cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);

//         console.log("Filtered Cart Items Array:", cartItemsArray); // 🔍 Debugging

//         if (cartItemsArray.length === 0) {
//             return toast.error("Cart is empty");
//         }

//         const token = await getToken();
//         const { data } = await axios.post(
//             "/api/order/create",
//             { address: selectedAddress._id, items: cartItemsArray },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (data.success) {
//             toast.success(data.message);
//             setCartItems({});
//             router.push("/order-placed");
//         } else {
//             toast.error(data.message);
//         }
//     } catch (error) {
//         console.error("Error creating order:", error);
//         toast.error("Failed to create order.");
//     }
// };

//   return (
//     <div className="w-full md:w-96 bg-gray-500/5 p-5">
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
//       <hr className="border-gray-500/30 my-5" />

//       <div className="space-y-6">
//         {/* Address Dropdown */}
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Select Address
//           </label>
//           <div className="relative inline-block w-full text-sm border">
//             <button
//               className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               <span>
//                 {selectedAddress
//                   ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
//                   : "Select Address"}
//               </span>
//               <svg
//                 className={`w-5 h-5 inline float-right transition-transform duration-200 ${
//                   isDropdownOpen ? "rotate-180" : "rotate-0"
//                 }`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="#6B7280"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {/* Dropdown List */}
//             {isDropdownOpen && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.length > 0 ? (
//                   userAddresses.map((address, index) => (
//                     <li
//                       key={index}
//                       className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
//                       onClick={() => handleAddressSelect(address)}
//                     >
//                       {address.fullName}, {address.area}, {address.city}, {address.state}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-4 py-2 text-gray-500">No addresses found</li>
//                 )}
//                 {/* Add New Address Option */}
//                 <li
//                   onClick={() => router.push("/add-address")}
//                   className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
//                 >
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         <hr className="border-gray-500/30 my-5" />

//         {/* Order Summary */}
//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">Free</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Place Order Button */}
//       <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
//         Place Order
//       </button>
//     </div>
//   );
// };

// export default OrderSummary;
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { currency, getToken, user, getCartCount, getCartAmount, router, cartItems } = useAppContext();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  useEffect(() => {
    console.log("OrderSummary - Cart Items:", cartItems); // Debugging
  }, [cartItems]);

  // Fetch Addresses from API
  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/data/get-address', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        console.log("Fetched Addresses:", data.addresses);
        setUserAddresses(data.addresses);

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  // Handle Address Selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      console.log("Cart Items before filtering:", cartItems);

      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key],
      })).filter(item => item.quantity > 0);

      console.log("Filtered Cart Items Array:", cartItemsArray);

      if (cartItemsArray.length === 0) {
        return toast.error("Cart is empty");
      }

      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/create",
        { address: selectedAddress._id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/order-placed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order.");
    }
  };

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}` : "Select Address"}
            </button>
            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.length > 0 ? (
                  userAddresses.map((address, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer" onClick={() => handleAddressSelect(address)}>
                      {address.fullName}, {address.area}, {address.city}, {address.state}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No addresses found</li>
                )}
                <li onClick={() => router.push("/add-address")} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center">
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
