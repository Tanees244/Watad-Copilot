import mongoose from 'mongoose';

const SpecificationSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true 
  },
  value: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  unit: { 
    type: String,
    default: '' 
  },
  fullDescription: {
    type: String,
    default: ''
  },
  specifications: {
    type: Map, 
    of: String, 
    default: {}
  },
  price: { 
    type: Number, 
    default: 0 
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'anonymous',
    },
    products: [ProductSchema],
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
    orderSummary: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

OrderSchema.pre('save', function (next) {
  const summaryLines = [
    '**Order Summary**',
    '**Customer Information:**',
    `* Name: ${this.customerName}`,
    `* Phone: ${this.customerPhone}`,
    `* Address: ${this.customerAddress}`,
    '**Order Details:**'
  ];

  this.products.forEach((product) => {
    let productDetails = `* ${product.name}: ${product.quantity} ${product.unit}`;

    if (product.specifications && product.specifications.size > 0) {
      const specDetails = Array.from(product.specifications.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      productDetails += ` (${specDetails})`;
    }

    summaryLines.push(productDetails);
  });

  summaryLines.push('You will receive a confirmation email shortly. Thank you for your order!');

  this.orderSummary = summaryLines.join('\n');

  // Calculate total amount
  this.totalAmount = this.products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);

  next();
});


export default mongoose.models.Order || mongoose.model('Order', OrderSchema);