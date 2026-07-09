import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const addProduct = async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, category,
      images, fabric, care, variants, sizeGuide, isNew, isFeatured
    } = req.body;

    // Guard: category is required
    if (!category) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    
    let categoryId = category;
    if (typeof category === 'string') {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({ 
          message: `Category "${category}" not found. Please create it first or use existing category.` 
        });
      }
      categoryId = categoryDoc._id;
    }

    if (variants && variants.length > 0) {
      const skus = variants.map(v => v.sku).filter(Boolean);
      const duplicateSkuProduct = await Product.findOne({ 'variants.sku': { $in: skus } });
      if (duplicateSkuProduct) {
        return res.status(400).json({ message: 'One or more variant SKUs already exist in another product.' });
      }
    }

    const product = await Product.create({
      name, 
      description, 
      price, 
      discountPrice, 
      category: categoryId,  // Use the converted ObjectId
      images, 
      fabric, 
      care, 
      variants, 
      sizeGuide, 
      isNew, 
      isFeatured
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('addProduct failed:', error);
    res.status(500).json({ message: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If category is being updated as a string, convert to ObjectId
    if (updateData.category && typeof updateData.category === 'string') {
      const categoryDoc = await Category.findOne({ name: updateData.category });
      if (!categoryDoc) {
        return res.status(400).json({ 
          message: `Category "${updateData.category}" not found.` 
        });
      }
      updateData.category = categoryDoc._id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('editProduct failed:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product successfully removed from catalogue' });
  } catch (error) {
    console.error('deleteProduct failed:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({ path: 'category', select: 'name', strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('getAllProducts failed:', error);
    res.status(500).json({ message: error.message });
  }
};