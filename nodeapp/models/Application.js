const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'under review', 'accepted', 'rejected'],
    default: 'submitted'
  },
  documents: [{
    name: String,
    data: String,
    mimeType: String,
    size: Number
  }],
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: String,
  dateOfBirth: Date,
  education: String,
  statementOfPurpose: {
    type: String,
    maxlength: 1000
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Create indexes
applicationSchema.index({ userId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ submittedAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;