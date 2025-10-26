import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    banking: {
        balance: { type: Number, default: 0 },
        pixKey: { type: String, default: "" },
        taxId: { type: String, default: "" },
    }
});

const User = mongoose.model("User", UserSchema);

export default User;

