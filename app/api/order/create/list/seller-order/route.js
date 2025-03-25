import Address from "@/config/address";
import connectDB from "@/config/db";
import Order from "@/config/Order";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const isSeller = await authSeller(userId)
        if(!isSeller){
            return NextResponse.json({
                success: false,
                message: 'You are not authorized to add products'
            }, { status: 403 });
        }
        await connectDB()
        Address.length 
        const orders = await Order.find({}).populate("address items.product");
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        
    }
}