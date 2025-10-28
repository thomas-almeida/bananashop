import { Router } from "express";
import { createUser, getUserById } from "../controller/userController.js";
import storeRoutes from "./storeRoutes.js";
import productRoutes from "./productRoutes.js";

const api = Router();

// Rotas de usuário
api.post("/user", createUser);
api.get("/user/:userId", getUserById);

// Rotas de upload
api.use('/upload-file', uploadRoutes);

// Rotas de lojas
api.use('/stores', storeRoutes);

// Rotas de produtos
api.use('/products', productRoutes);


export default api;