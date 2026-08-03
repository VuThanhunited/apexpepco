const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  variant: { name: String, price: Number },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: 'US' },
  phone: String,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: { type: String },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  shippingAddress: shippingAddressSchema,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'pending' },
  notes: { type: String },
  trackingNumber: { type: String },
}, { timestamps: true });

orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `AP-${timestamp}${random}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
