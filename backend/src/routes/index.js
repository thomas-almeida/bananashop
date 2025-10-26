import { Router } from "express";
import { createUser, getUserById } from "../controller/userController.js";

const api = Router();

api.post("/user", createUser);
api.get("/user/:userId", getUserById);

export default api;