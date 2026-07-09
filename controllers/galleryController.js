import GalleryImage from '../models/GalleryImage.js';

export const addGalleryImage = async (req, res) => {
  try {
    const { image, label } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'Image is required.' });
    }
    const galleryImage = await GalleryImage.create({ image, label });
    res.status(201).json({ success: true, data: galleryImage });
  } catch (error) {
    console.error('addGalleryImage failed:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllGalleryImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    console.error('getAllGalleryImages failed:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const galleryImage = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.json({ success: true, message: 'Gallery image removed' });
  } catch (error) {
    console.error('deleteGalleryImage failed:', error);
    res.status(500).json({ message: error.message });
  }
};