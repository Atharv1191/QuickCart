import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    offerPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: [String], // Ensure array contains strings (URLs)
        required: true
    },
    date: {
        type: Date, // Use `Date` type instead of `Number`
        default: Date.now
    }
});

// ✅ Fix: Ensure correct case when checking existing model
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
