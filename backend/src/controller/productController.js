import Product from "../db/models/Products.js";
import Store from "../db/models/Store.js";
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
const pipelineAsync = promisify(pipeline);

export const createProduct = async (req, res) => {
    try {
        const { storeId } = req.params;
        const {
            productId,
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

        let product;
        let isNewProduct = true;

        // Se um productId for fornecido, tenta atualizar o produto existente
        if (productId) {
            product = await Product.findOne({ _id: productId, store: storeId });

            if (!product) {
                return res.status(404).json({ message: "Product not found in this store" });
            }

            // Atualiza os campos do produto
            product.name = name || product.name;
            product.price = price !== undefined ? price : product.price;
            product.description = description || product.description;
            product.brand = brand !== undefined ? brand : product.brand;
            product.images = images || product.images;
            product.category = category || product.category;
            product.inStorage = inStorage !== undefined ? inStorage : product.inStorage;

            isNewProduct = false;
        } else {
            // Cria um novo produto
            product = new Product({
                name,
                price,
                description,
                brand: brand || "",
                images: images || [],
                category: category || "",
                inStorage: inStorage || 0,
                store: storeId
            });

            // Define o publicLink para novos produtos
            product.publicLink = `${process.env.PUBLIC_BASEURL}/produto/${product._id}`;

            // Adiciona o produto à loja
            store.products.push(product._id);
            await store.save();
        }

        // Salva o produto (cria ou atualiza)
        await product.save();

        return res.status(isNewProduct ? 201 : 200).json({
            message: isNewProduct
                ? "Product created successfully"
                : "Product updated successfully",
            product
        });
    } catch (error) {
        console.error(`Error ${req.params.productId ? 'updating' : 'creating'} product:`, error);
        return res.status(500).json({
            message: `Error ${req.params.productId ? 'updating' : 'creating'} product`,
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Busca o produto pelo ID
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error getting product:", error);
        return res.status(500).json({
            message: "Error getting product",
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
