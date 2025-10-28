import { Router } from "express";
import { createUser, getUserById } from "../controller/userController.js";
import { upload, uploadImage } from "../controller/uploadController.js";
import storeRoutes from "./storeRoutes.js";
import productRoutes from "./productRoutes.js";

const api = Router();

// Rotas de usuário
api.post("/user", createUser);
api.get("/user/:userId", getUserById);

// Rotas de lojas
api.use('/stores', storeRoutes);

// Rotas de produtos
api.use('/products', productRoutes);

// Rotas de upload
api.post('/upload-image', upload.single('image'), uploadImage);

export default api;