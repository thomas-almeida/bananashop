import Product from "../db/models/Products.js";
import Store from "../db/models/Store.js";

export const createProduct = async (req, res) => {
    try {
        const { storeId } = req.params;
        const {
            name,
            price,
            description,
            brand,
            images,
            category,
            inStorage
        } = req.body;

        // Verifica se a loja existe
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        // Primeiro cria o produto sem o publicLink
        const product = new Product({
            name,
            price,
            description,
            brand: brand || "",
            images: images || [],
            category: category || "",
            inStorage: inStorage || 0,
            store: storeId
        });

        // Depois de criado, atualiza o publicLink com o ID gerado
        product.publicLink = `${process.env.PUBLIC_BASEURL}/produto/${product._id}`;

        // Salva o produto
        await product.save();

        // Adiciona o produto à loja
        store.products.push(product._id);
        await store.save();

        return res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
};

export const getProductsByStore = async (req, res) => {
    try {
        const { storeId } = req.params;

        // Busca os produtos da loja
        const products = await Product.find({ store: storeId })
            .select('-__v')
            .lean();

        return res.status(200).json(products);
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({
            message: "Error getting products",
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        // Atualiza o produto
        const product = await Product.findByIdAndUpdate(
            productId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Encontra o produto para obter a loja
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove o produto da coleção de produtos da loja
        await Store.findByIdAndUpdate(
            product.store,
            { $pull: { products: productId } },
            { new: true }
        );

        // Remove o produto
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
};
