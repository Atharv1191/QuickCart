=import connectDB from "@/config/db";
import Order from "@/config/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Read raw body from request
    const rawBody = await request.arrayBuffer();
    const body = Buffer.from(rawBody);

    // Get Stripe signature from headers
    const sig = request.headers.get("stripe-signature");

    // Construct the Stripe event
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    const handlePaymentIntent = async (paymentIntentId, isPaid) => {
      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;

      await connectDB();

      if (isPaid) {
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        await User.findByIdAndUpdate(userId, { cartItems: {} });
      } else {
        await Order.findByIdAndUpdate(orderId); // maybe add cancellation logic here?
      }
    };

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntent(event.data.object.id, true);
        break;
      case "payment_intent.canceled":
        await handlePaymentIntent(event.data.object.id, false);
        break;
      default:
        console.error(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// ✅ Must be outside the function!
export const config = {
  api: {
    bodyParser: false,
  },
};
