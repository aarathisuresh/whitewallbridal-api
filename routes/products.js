import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Your existing JWT verification middleware
import { 
  addProduct, 
  editProduct, 
  deleteProduct, 
  getAllProducts 
} from '../controllers/productController.js';

const router = express.Router();


const adminOnly = (req, res, next) => {

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Administrator clearance required.' });
  }
};


router.get('/', getAllProducts);


router.post('/', protect, adminOnly, addProduct);         // Add Product
router.put('/:id', protect, adminOnly, editProduct);      // Edit Product & Stock Management
router.delete('/:id', protect, adminOnly, deleteProduct);  // Delete Product

export default router;