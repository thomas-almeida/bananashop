import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import {
  createProduct,
  getProductsByStore,
  updateProduct,
  deleteProduct
} from '../controller/productController.js';

import { importProductsFromCSV } from '../controller/importController.js';

// ✅ Configura o Multer para armazenar arquivos apenas em memória
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * Importa produtos via CSV
 * POST /api/products/:storeId/import
 */
router.post('/:storeId/import', upload.single('file'), importProductsFromCSV);


/**
 * Cria um novo produto em uma loja
 * POST /api/products/:storeId/create
 */
router.post('/:storeId/create', createProduct);

/**
 * Lista todos os produtos de uma loja
 * GET /api/products/:storeId
 */
router.get('/:storeId', getProductsByStore);

/**
 * Atualiza um produto
 * PUT /api/products/:productId/update
 */
router.put('/:productId/update', updateProduct);

/**
 * Remove um produto
 * DELETE /api/products/:productId/delete
 */
router.delete('/:productId/delete', deleteProduct);

export default router;
