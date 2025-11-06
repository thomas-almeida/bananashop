import User from "../db/models/User.js";

export async function createUser(req, res) {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(201).json({ user: existingUser });
        }

        const user = new User({ username, email });
        user.save()

        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user" });
    }
}

export async function getUserById(req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        return res.status(500).json({
            message: "Error getting user",
            error: error.message
        });
    }
}

export async function updateUser(req, res) {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const allowedUpdates = ['taxID', 'pixKey', 'rate'];

        const updatesToApply = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updatesToApply[key] = updates[key];
            }
        });

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatesToApply, { new: true });

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
}