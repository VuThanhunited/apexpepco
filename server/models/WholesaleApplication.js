const mongoose = require('mongoose');

const wholesaleSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  businessType: { type: String },
  expectedMonthlyVolume: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('WholesaleApplication', wholesaleSchema);
