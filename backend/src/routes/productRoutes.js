import { Router } from 'express';
import { 
    createProduct, 
    getProductsByStore, 
    updateProduct, 
    deleteProduct 
} from '../controller/productController.js';

const router = Router();

// Cria um novo produto em uma loja
// POST /api/stores/:storeId/products
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
