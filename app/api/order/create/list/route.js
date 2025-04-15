
// import connectDB from "@/config/db";
// import Address from "@/config/address";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Order from "@/config/Order";

// export async function GET(request) {
//     try {
//         await connectDB(); // Ensure database is connected

//         const { userId } = getAuth(request);
//         if (!userId) {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         console.log("Fetching orders for userId:", userId);

//         const orders = await Order.find({ userId }).populate("address items.product");

//         console.log("Orders fetched:", orders);

//         return NextResponse.json({ success: true, orders });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         return NextResponse.json(
//             { success: false, message: error.message || "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Order from "@/config/Order";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB(); // Ensure database is connected
        console.log("MongoDB Connection Status:", mongoose.connection.readyState);

        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        console.log("Fetching orders for userId:", userId);

        // Log all existing orders in the database
        const allOrders = await Order.find();
        console.log("All orders in DB:", allOrders);

        // Log stored userIds to compare
        allOrders.forEach(order => console.log(`Stored Order userId: ${order.userId}`));
        
        // Use a case-insensitive regex match to prevent subtle differences
        const orders = await Order.find({ userId: new RegExp(`^${userId}$`, "i") }).populate("address items.product");

        console.log("Orders fetched:", orders);

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

