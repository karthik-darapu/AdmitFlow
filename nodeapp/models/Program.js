const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  duration: String,
  fees: Number,
  deadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalSeats: Number,
  availableSeats: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Create indexes
programSchema.index({ title: 1 }, { unique: true });
programSchema.index({ deadline: 1 });
programSchema.index({ isActive: 1 });

const Program = mongoose.model('Program', programSchema);

module.exports = Program;