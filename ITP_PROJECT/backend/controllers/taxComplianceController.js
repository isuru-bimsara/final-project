const TaxCompliance = require('../models/taxComplianceModel');

// Get all tax records
exports.getTaxRecords = async (req, res) => {
  try {
    const { period, status, taxType } = req.query;
    let filter = {};
    
    if (period) filter.period = period;
    if (status) filter.status = status;
    if (taxType) filter.taxType = taxType;
    
    const taxRecords = await TaxCompliance.find(filter).sort({ dueDate: 1 });
    res.status(200).json({ success: true, data: taxRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tax record by ID
exports.getTaxRecord = async (req, res) => {
  try {
    const taxRecord = await TaxCompliance.findById(req.params.id);
    if (!taxRecord) {
      return res.status(404).json({ success: false, message: 'Tax record not found' });
    }
    res.status(200).json({ success: true, data: taxRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new tax record
exports.createTaxRecord = async (req, res) => {
  try {
    const taxRecord = new TaxCompliance(req.body);
    await taxRecord.save();
    res.status(201).json({ success: true, data: taxRecord });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update tax record
exports.updateTaxRecord = async (req, res) => {
  try {
    const taxRecord = await TaxCompliance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!taxRecord) {
      return res.status(404).json({ success: false, message: 'Tax record not found' });
    }
    
    res.status(200).json({ success: true, data: taxRecord });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete tax record
exports.deleteTaxRecord = async (req, res) => {
  try {
    const taxRecord = await TaxCompliance.findByIdAndDelete(req.params.id);
    
    if (!taxRecord) {
      return res.status(404).json({ success: false, message: 'Tax record not found' });
    }
    
    res.status(200).json({ success: true, message: 'Tax record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Make tax payment
exports.makeTaxPayment = async (req, res) => {
  try {
    const { paymentAmount, paymentDate } = req.body;
    const taxRecord = await TaxCompliance.findById(req.params.id);
    
    if (!taxRecord) {
      return res.status(404).json({ success: false, message: 'Tax record not found' });
    }
    
    const newPaidAmount = taxRecord.paidAmount + paymentAmount;
    
    // Update payment details
    taxRecord.paidAmount = newPaidAmount;
    taxRecord.paymentDate = paymentDate || new Date();
    
    // Update status based on payment
    if (newPaidAmount >= taxRecord.amount) {
      taxRecord.status = 'Paid';
    } else if (newPaidAmount > 0) {
      taxRecord.status = 'Partially Paid';
    }
    
    await taxRecord.save();
    res.status(200).json({ success: true, data: taxRecord });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get tax summary
exports.getTaxSummary = async (req, res) => {
  try {
    const { year } = req.query;
    let matchStage = {};
    
    if (year) {
      matchStage.period = { $regex: `^${year}` };
    }
    
    const summary = await TaxCompliance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$taxType',
          totalAmount: { $sum: '$amount' },
          totalPaid: { $sum: '$paidAmount' },
          totalPenalty: { $sum: '$penalty' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};