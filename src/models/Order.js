import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  product: {
    title: String,
    category: String,
    subcategory: String,
  },
  quantity: Number,
  unitOfMeasurement: String,
  deliveryDate: Date,
  splitOrder: Boolean,
  additionalInfo: String,
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  userId: String, // Optional: for future user tracking
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);