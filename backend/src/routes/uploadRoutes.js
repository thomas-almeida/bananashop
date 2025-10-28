// routes/uploadRoutes.js
import express from 'express';
import { upload, uploadImage } from '../controller/uploadController.js';

const router = express.Router();

// Rota para upload de imagem

router.post('/upload', upload.single('image'), uploadImage);

export default router;