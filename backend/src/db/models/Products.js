import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, default: "" },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, default: "" },
    inStorage: { type: Number, default: 0 },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    publicLink: { type: String, default: "" }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;