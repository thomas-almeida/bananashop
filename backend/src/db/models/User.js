import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        default: null
    },
    banking: {
        balance: { type: Number, default: 0 },
        pixKey: { type: String, default: "" },
        taxId: { type: String, default: "" },
        rate: { type: Number, default: 0.05 }
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;

