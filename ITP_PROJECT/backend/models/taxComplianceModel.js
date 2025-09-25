const mongoose = require('mongoose');

const taxComplianceSchema = new mongoose.Schema({
  taxType: {
    type: String,
    required: true,
    enum: ['Income Tax', 'VAT', 'NBT', 'ESC', 'Stamp Duty', 'Other']
  },
  period: {
    type: String,
    required: true // Format: YYYY-MM or YYYY-Q1, etc.
  },
  dueDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  description: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String
  }],
  penalty: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Calculate if tax is overdue
taxComplianceSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && this.status !== 'Paid';
});

// Calculate remaining amount
taxComplianceSchema.virtual('remainingAmount').get(function() {
  return this.amount - this.paidAmount;
});

module.exports = mongoose.model('TaxCompliance', taxComplianceSchema);