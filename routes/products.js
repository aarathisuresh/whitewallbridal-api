import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
} from '../controllers/productController.js';
import { protect, isAdminOrStaff } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

router.post('/', protect, isAdminOrStaff, createProduct);
router.put('/:id', protect, isAdminOrStaff, updateProduct);
router.delete('/:id', protect, isAdminOrStaff, deleteProduct);

export default router;