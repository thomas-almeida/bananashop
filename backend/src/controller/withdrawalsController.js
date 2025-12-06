import Withdrawals from "../db/models/Withdrawals.js";
import User from "../db/models/User.js"

export async function withdrawalRequest(req, res) {
    try {
        const { value, userId, storeId } = req.body;

        if (!value || !userId || !storeId) {
            return res.status(400).json({ message: "Value, userId, and storeId are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const withdraw = new Withdrawals({
            value,
            userId,
            storeId,
            status: "PENDING",
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        user.banking.balance -= value;
        await user.save();
        await withdraw.save()

        return res.status(201).json({ message: "Withdrawal request created successfully", withdraw });
    } catch (error) {
        return res.status(500).json({ message: "Error creating withdrawal request", error });
    }
}

export async function getWithdrawsByUserId(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const withdraws = await Withdrawals.find({ userId });

        return res.status(200).json({ withdraws });
    } catch (error) {
        return res.status(500).json({ message: "Error getting withdrawal" });
    }
}
