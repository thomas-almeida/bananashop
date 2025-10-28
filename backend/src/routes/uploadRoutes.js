import express from 'express';
import multer from 'multer';
import { uploadToDrive } from '../controller/uploadController.js';

const router = express.Router();

// usa o multer para lidar com o upload
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadToDrive);

export default router;
