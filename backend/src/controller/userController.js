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

