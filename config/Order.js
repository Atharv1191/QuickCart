import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: String,  // Change from ObjectId to String
        required: true,
        ref: "User"  
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Address"
    },
    status: {
        type: String,
        required: true,
        default: "Order Placed"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
