import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    productId: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    storeId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
