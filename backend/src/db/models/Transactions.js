import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        postalCode: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    status: { type: String, default: "PENDING" }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
