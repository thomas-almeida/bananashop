import { Router } from 'express';
import {
    createProduct,
    getProductsByStore,
    updateProduct,
    deleteProduct
} from '../controller/productController.js';
import { importProductsFromCSV } from '../controller/importController.js';
import { uploadToDrive } from '../controller/uploadController.js';
import { uploadImage } from '../services/googleDriveService.js';
import multer from 'multer';
import path from 'path';

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const router = Router();

// Importa produtos via CSV
// POST /api/products/:storeId/import
router.post('/:storeId/import', upload.single('file'), importProductsFromCSV);

// POST /api/products/upload-file
router.post('/upload-file', upload.single('file'), uploadToDrive);

// Upload de imagem
// POST /api/products/upload-image
router.post('/upload-image', upload.single('image'), uploadImage);

// Cria um novo produto em uma loja
// POST /api/products/:storeId/create
router.post('/:storeId/create', createProduct);

// Lista todos os produtos de uma loja
// GET /api/stores/:storeId/products
router.get('/:storeId', getProductsByStore);

// Atualiza um produto
// PUT /api/products/:productId
router.put('/:productId/update', updateProduct);

// Remove um produto
// DELETE /api/products/:productId
router.delete('/:productId/delete', deleteProduct);

export default router;
