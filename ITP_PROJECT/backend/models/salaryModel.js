// const mongoose = require('mongoose');

// const salarySchema = new mongoose.Schema({
//   employeeName: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     required: true
//   },
//   basicSalary: {
//     type: Number,
//     required: true,
//   },
//   allowances: {
//     type: Number,
//     default: 0,
//   },
//   deductions: {
//     type: Number,
//     default: 0,
//   },
//   otHours: {
//     type: Number,
//     default: 0,
//   },
//   otRate: {
//     type: Number,
//     default: 1.5,
//   },
//   otPay: {
//     type: Number,
//     default: 0,
//   },
//   epfRate: {
//     type: Number,
//     default: 8,
//   },
//   epfDeduction: {
//     type: Number,
//     default: 0,
//   },
//   etfRate: {
//     type: Number,
//     default: 3,
//   },
//   etfDeduction: {
//     type: Number,
//     default: 0,
//   },
//   netSalary: {
//     type: Number,
//     required: true,
//   },
//   paymentDate: {
//     type: Date,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Paid'],
//     default: 'Pending',
//   },
// }, { timestamps: true });

// // Pre-save Hook to Auto-calculate Values
// salarySchema.pre('save', function (next) {
//   // Calculate hourly rate (assuming 160 work hours per month)
//   const hourlyRate = this.basicSalary / 160;

//   // Calculate OT Pay
//   this.otPay = this.otHours * hourlyRate * this.otRate;

//   // Calculate EPF & ETF deductions
//   this.epfDeduction = (this.basicSalary + this.otPay) * (this.epfRate / 100);
//   this.etfDeduction = (this.basicSalary + this.otPay) * (this.etfRate / 100);

//   // Calculate Net Salary
//   this.netSalary = 
//     this.basicSalary + 
//     this.otPay + 
//     this.allowances - 
//     (this.deductions + this.epfDeduction + this.etfDeduction);

//   next();
// });

// module.exports = mongoose.model('Salary', salarySchema);


const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  otHours: {
    type: Number,
    default: 0,
    min: 0
  },
  otRate: {
    type: Number,
    default: 1.5
  },
  otPay: {
    type: Number,
    default: 0
  },
  epfRate: {
    type: Number,
    default: 8
  },
  epfDeduction: {
    type: Number,
    default: 0
  },
  etfRate: {
    type: Number,
    default: 3
  },
  etfDeduction: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
}, { 
  timestamps: true 
});

// Remove the pre-save hook to avoid conflicts
// salarySchema.pre('save', function (next) {
//   // Calculations are now done in the controller
//   next();
// });

module.exports = mongoose.model('Salary', salarySchema);