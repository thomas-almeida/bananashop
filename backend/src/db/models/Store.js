import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    igNickname: { type: String, required: true },
    image: { type: String, default: "" },
    publicLink: { type: String, default: "" },
    views: { type: Number, default: 0 },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

const Store = mongoose.model("Store", StoreSchema);

export default Store;

