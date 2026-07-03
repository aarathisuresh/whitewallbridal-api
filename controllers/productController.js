import Product from '../models/Product.js';


export const addProduct = async (req, res) => {
  try {
    const { 
      name, description, price, discountPrice, category, 
      images, fabric, care, variants, sizeGuide, isNew, isFeatured 
    } = req.body;

  
    if (variants && variants.length > 0) {
      const skus = variants.map(v => v.sku).filter(Boolean);
      const duplicateSkuProduct = await Product.findOne({ 'variants.sku': { $in: skus } });
      if (duplicateSkuProduct) {
        return res.status(400).json({ message: 'One or more variant SKUs already exist in another product.' });
      }
    }

    const product = await Product.create({
      name, description, price, discountPrice, category,
      images, fabric, care, variants, sizeGuide, isNew, isFeatured
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name') 
      .sort({ createdAt: -1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};