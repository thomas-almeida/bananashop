import Store from "../db/models/Store.js";
import User from "../db/models/User.js";

export const createStore = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, description, igNickname, image, whatsappNumber } = req.body;

        // Verifica se o usuário existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verifica se o usuário já tem uma loja
        if (user.store) {
            return res.status(400).json({ message: "User already has a store" });
        }

        // Cria a loja
        const store = new Store({
            name,
            description,
            igNickname,
            image: image || "",
            whatsappNumber,
            owner: userId,
            publicLink: `${process.env.PUBLIC_BASEURL}/loja/${name.toLowerCase().replace(/\s/g, '-')}`
        });

        // Salva a loja
        await store.save();

        // Atualiza o usuário com a referência para a loja
        user.store = store._id;
        await user.save();

        return res.status(201).json({
            message: "Store created successfully",
            store
        });
    } catch (error) {
        console.error("Error creating store:", error);
        return res.status(500).json({
            message: "Error creating store",
            error: error.message
        });
    }
};

export const getStoreByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Busca a loja pelo ID do dono
        const store = await Store.findOne({ owner: userId })
            .populate('products', 'name price images')
            .lean();

        if (!store) {
            return res.status(404).json({ message: "Store not found for this user" });
        }

        return res.status(200).json(store);
    } catch (error) {
        console.error("Error getting store:", error);
        return res.status(500).json({
            message: "Error getting store",
            error: error.message
        });
    }
};


export const updateStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const updates = req.body;
        const allowedUpdates = ['name', 'description', 'igNickname', 'image', 'publicLink'];

        // Filtra apenas os campos permitidos para atualização
        const updatesToApply = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updatesToApply[key] = updates[key];
            }
        });

        // Atualiza a loja
        const store = await Store.findByIdAndUpdate(
            storeId,
            { $set: updatesToApply },
            { new: true, runValidators: true }
        );

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        return res.status(200).json({
            message: "Store updated successfully",
            store
        });
    } catch (error) {
        console.error("Error updating store:", error);
        return res.status(500).json({
            message: "Error updating store",
            error: error.message
        });
    }
};