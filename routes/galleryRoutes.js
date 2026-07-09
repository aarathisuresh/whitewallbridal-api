import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
} from '../controllers/galleryController.js';

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Administrator clearance required.' });
  }
};

router.get('/', getAllGalleryImages);                          // public — feeds the customer Gallery

router.post('/', protect, adminOnly, addGalleryImage);         // admin only
router.delete('/:id', protect, adminOnly, deleteGalleryImage); // admin only

export default router;