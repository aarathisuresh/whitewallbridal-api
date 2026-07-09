import mongoose from 'mongoose';

// Flexible order schema that mirrors the frontend `Order` interface.
// Kept separate from the strict e-commerce `Order` model so it can hold
// custom-design requests, social-commerce orders, and website purchases
// (free-text items, measurements, reference images, etc.) without conflict.
const atelierOrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String },            // e.g. WWB-1234 (display id)
    clientName: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    source: { type: String, default: 'Website' }, // Website / Boutique / Instagram / WhatsApp / Social Media
    items: { type: String, default: '' },   // free-text description
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Pattern Cutting', 'In Tailoring', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
    isCustom: { type: Boolean, default: false },
    metrics: { type: String, default: '' },  // e.g. "B:34 W:28 H:38"
    notes: { type: String, default: '' },
    instagramHandle: { type: String, default: '' },
    interactionNotes: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid'],
      default: 'Unpaid',
    },
    amountPaid: { type: Number, default: 0 },
    paymentMethod: { type: String, default: '' },
    trackingId: { type: String, default: '' },
    courier: { type: String, default: '' },
    referenceImages: { type: [String], default: [] }, // base64 data URLs
  },
  { timestamps: true }
);

export default mongoose.model('AtelierOrder', atelierOrderSchema);