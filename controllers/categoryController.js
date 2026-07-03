import Category from '../models/Category.js';

// GET /api/categories  — used by the admin product dropdown
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('getAllCategories failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categories  — create a new category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'A category with that name already exists.' });
    }

    const category = await Category.create({ name: name.trim(), description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('addCategory failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    console.error('deleteCategory failed:', error);
    res.status(500).json({ message: error.message });
  }
};