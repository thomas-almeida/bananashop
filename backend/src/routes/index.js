import { Router } from "express";
import { createUser, getUserById, updateUser } from "../controller/userController.js";
import { upload, uploadImage } from "../controller/uploadController.js";
import { createTransaction, abacatepayWebhook } from "../controller/transactionController.js";
import storeRoutes from "./storeRoutes.js";
import productRoutes from "./productRoutes.js";

const api = Router();

// Rotas de usuário
api.post("/user", createUser);
api.get("/user/:userId", getUserById);
api.put("/user/:userId", updateUser);


// Rotas de lojas
api.use('/stores', storeRoutes);

// Rotas de produtos
api.use('/products', productRoutes);

// Rotas de upload
api.post('/upload-image', upload.single('image'), uploadImage);

// Transações
api.post('/transaction', createTransaction);
api.post('/abacatepay', abacatepayWebhook);

export default api;