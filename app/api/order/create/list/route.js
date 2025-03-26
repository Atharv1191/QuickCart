
import connectDB from "@/config/db";
import Address from "@/config/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Order from "@/config/Order";

export async function GET(request) {
    try {
        await connectDB(); // Ensure database is connected

        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        console.log("Fetching orders for userId:", userId);

        const orders = await Order.find({ userId }).populate("address items.product");

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

