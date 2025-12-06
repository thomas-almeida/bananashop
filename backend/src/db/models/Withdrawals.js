import mongoose from "mongoose";

const WithdrawalsSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    status: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
})

const Withdrawals = mongoose.model("Withdrawals", WithdrawalsSchema);

export default Withdrawals;