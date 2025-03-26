import Order from "@/config/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Stripe from "stripe";
import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();
        const origin = request.headers.get("origin");
        if (!userId || !address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }
        let productData = []

        // ✅ Calculate total amount
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,

            })
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
        const order = new Order({
            userId,
            address: addressObjectId,
            items,
            amount,
            paymentType: "Stripe",
            date: Date.now()

        });
        //create line items for stripe
        const line_items = productData.map(items => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: items.name
                    },
                    unit_amount: items.price * 100,

                },
                quantity: items.quantity
            }
        })
        //create session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/order-placed`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId
            }
        })
        const url = session.url
        return NextResponse.json({
            success: true,
            url
        })
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );

    }
}