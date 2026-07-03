import express from 'express';

import { protect, isAdminOrStaff } from '../middleware/auth.js'; 
import { 
  addProduct, 
  editProduct, 
  deleteProduct, 
  getAllProducts 
} from '../controllers/productController.js';

const router = express.Router();


router.get('/', getAllProducts);


router.post('/', protect, isAdminOrStaff, addProduct);         
router.put('/:id', protect, isAdminOrStaff, editProduct);     
router.delete('/:id', protect, isAdminOrStaff, deleteProduct);  

export default router;