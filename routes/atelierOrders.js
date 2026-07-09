import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
import {
  createAtelierOrder,
  getAllAtelierOrders,
  updateAtelierOrder,
} from '../controllers/atelierOrderController.js';

const router = express.Router();

// Public: a customer (logged in or not) can submit a custom-design request.
router.post('/', createAtelierOrder);

// Admin only: view every order and edit status / payment / delivery inline.
router.get('/', protect, isAdmin, getAllAtelierOrders);
router.patch('/:id', protect, isAdmin, updateAtelierOrder);

export default router;