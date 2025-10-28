import { Router } from 'express';
import { upload, uploadImage } from '../controller/uploadController.js';

const router = Router();

// Rota para upload de imagens
// POST /api/upload/image
router.post('/image', upload.single('image'), uploadImage);

export default router;
