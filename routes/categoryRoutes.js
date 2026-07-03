import express from 'express';
import {
  getAllCategories,
  addCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', addCategory);       // add your auth/admin middleware here if you have it
router.delete('/:id', deleteCategory);

export default router;