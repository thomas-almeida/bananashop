import { Router } from "express";
import { createUser, getUserById } from "../controller/userController.js";
import storeRoutes from "./storeRoutes.js";
import productRoutes from "./productRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const api = Router();

// Rotas de usuário
api.post("/user", createUser);
api.get("/user/:userId", getUserById);

// Rotas de lojas
api.use('/stores', storeRoutes);

// Rotas de produtos
api.use('/products', productRoutes);

// Rotas de upload
api.use('/upload', uploadRoutes);

export default api;