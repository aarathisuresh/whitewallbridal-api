import mongoose from 'mongoose';

const CustomRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    measurements: {
      bust: Number,
      waist: Number,
      hip: Number,
      length: Number,
    },
    referenceImages: [
      {
        url: { type: String, required: true },
        publicId: String,
      },
    ],
    specialRequests: String,
    budget: { min: Number, max: Number },
    status: {
      type: String,
      enum: ['submitted', 'under-review', 'approved', 'completed'],
      default: 'submitted',
    },
    adminNotes: String,
    quotedPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model('CustomRequest', CustomRequestSchema);