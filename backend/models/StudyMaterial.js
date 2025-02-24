// backend/models/StudyMaterial.js
const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['iitjee', 'neet', 'boards', 'other']
  },
  subject: {
    type: String,
    required: true,
    enum: ['physics', 'chemistry', 'mathematics', 'physicaleducation']
  },
  price: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  students: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);