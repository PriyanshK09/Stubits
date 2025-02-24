const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userUpi: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  screenshot: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Payment', paymentSchema);