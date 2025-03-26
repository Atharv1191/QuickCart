
// import { inngest } from "@/config/ingest";
// import Product from "@/models/Product";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     try {
//         const { userId } = getAuth(request);
//         const { address, items } = await request.json();

//         if (!address || items.length === 0) {
//             return NextResponse.json({ success: false, message: "Invalid data" });
//         }

//         // ✅ Fix: Calculate amount correctly
//         let amount = 0;
//         for (const item of items) {
//             const product = await Product.findById(item.product);
//             amount += product.offerPrice * item.quantity;
//         }

//         // Add 2% fee
//         amount = amount + Math.floor(amount * 0.02);

//         await inngest.send({
//             name: "order/created",
//             data: {
//                 userId,
//                 address,
//                 items,
//                 amount,
//                 date: Date.now(),
//                 paymentType: "COD",
//             },
//         });

//         // ✅ Fix: Properly update the user's cart
//         await User.findByIdAndUpdate(userId, { cartItems: {} });

//         return NextResponse.json({
//             success: true,
//             message: "Order placed successfully",
//         });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

import Order from "@/config/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!userId || !address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // ✅ Calculate total amount
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({ success: false, message: "Product not found" });
            }
            amount += product.offerPrice * item.quantity;
        }

        // Add 2% processing fee
        amount = amount + Math.floor(amount * 0.02);

        // ✅ Ensure address is an ObjectId
        const addressObjectId = new mongoose.Types.ObjectId(address);

        // ✅ Create a new order using the Order model
        const newOrder = new Order({
            userId,
            address: addressObjectId,
            items,
            amount,
            paymentType: "COD",
            date: Date.now(),
            status: "Order Placed",
            isPaid: false,
        });

        // ✅ Save order in the database
        await newOrder.save();

        // ✅ Clear user's cart after order placement
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            order: newOrder, // Return order details
        });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}

