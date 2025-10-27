import { Router } from 'express';
import { createStore, getStoreByUserId, updateStore} from '../controller/storeController.js';

const router = Router();

// Cria uma nova loja para um usuário
// POST /api/stores/user/:userId
router.post('/:userId/create', createStore);

// Obtém a loja de um usuário específico
// GET /api/stores/user/:userId
router.get('/:userId', getStoreByUserId);

// Atualiza uma loja
// PUT /api/stores/:storeId
router.put('/:storeId/update', updateStore);

export default router;
