import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    channel: {
      type: String,
      enum: ['website', 'instagram', 'whatsapp', 'walk-in'],
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        size: String,
        color: String,
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    billingDetails: {
      customerName: String,
      phone: String,
      email: String,
    },
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer'],
      default: null,
    },
    notes: String,
  },
  { timestamps: true }
);

OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.orderNumber = `WW${date}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Order', OrderSchema);