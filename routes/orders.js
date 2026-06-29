import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protect, isAdminOrStaff } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

router.get('/admin/stats', protect, isAdminOrStaff, getDashboardStats);
router.put('/:id/status', protect, isAdminOrStaff, updateOrderStatus);

export default router;