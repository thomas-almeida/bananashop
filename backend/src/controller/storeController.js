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
        const normalizedName = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');

        const store = new Store({
            name,
            normalizedName,
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

export const getStoreById = async (req, res) => {
    try {
        const { storeId } = req.params;

        const store = await Store.findById(storeId)
            .populate('products', 'name price images')
            .populate('owner', 'username email')
            .lean();

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Loja não encontrada"
            });
        }

        // Incrementa o contador de visualizações
        await Store.findByIdAndUpdate(store._id, {
            $inc: { views: 1 }
        });
        store.views += 1; // Atualiza o objeto local para refletir o incremento

        return res.status(200).json({
            success: true,
            data: store
        });
    } catch (error) {
        console.error("Error getting store:", error);
        return res.status(500).json({
            message: "Error getting store",
            error: error.message
        });
    }
}

export const getStoreByName = async (req, res) => {
    try {
        const { storeName } = req.params;
        
        // Normaliza o nome da loja para busca (mesmo processo usado no modelo)
        const normalizedSearch = storeName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');

        const store = await Store.findOne({
            normalizedName: normalizedSearch
        })
            .populate('products', 'name price images description inStorage')
            .populate('owner', 'username email')
            .lean();

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Loja não encontrada"
            });
        }

        // Incrementa o contador de visualizações
        await Store.findByIdAndUpdate(store._id, {
            $inc: { views: 1 }
        });
        store.views += 1; // Atualiza o objeto local para refletir o incremento

        return res.status(200).json({
            success: true,
            data: store
        });

    } catch (error) {
        console.error('Erro ao buscar loja:', error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar loja",
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

        // Se o nome for atualizado, atualiza também o normalizedName
        if (updatesToApply.name) {
            updatesToApply.normalizedName = updatesToApply.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '');
        }

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