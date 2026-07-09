import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // base64 data URL, same as product images
    label: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('GalleryImage', galleryImageSchema);