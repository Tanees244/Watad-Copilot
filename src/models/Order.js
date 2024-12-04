import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'anonymous',
    },
    products: [
      {
        name: String,
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
      }
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'pending',
    },
    customerName: {
      type: String,
      default: ''
    },
    customerPhone: {
      type: String,
      default: ''
    },
    customerAddress: {
      type: String,
      default: ''
    },
    additionalNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);