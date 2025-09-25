const Expense = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, date, category, description } = req.body;

    if (!title || !amount || !category || !description || !date) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const newExpense = new Expense({ 
      title, 
      amount, 
      date, 
      category, 
      description 
    });
    
    await newExpense.save();

    res.status(201).json({ 
      success: true, 
      message: "Expense added successfully", 
      data: newExpense 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let filter = {};
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (category) filter.category = category;
    
    const expenses = await Expense.find(filter).sort({ date: -1 });
    
    res.status(200).json({ 
      success: true, 
      data: expenses 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: "Expense not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: expense 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: "Expense not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Expense updated successfully", 
      data: expense 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: "Expense not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Expense deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    let matchStage = {};
    
    if (year) {
      matchStage.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    
    if (month && year) {
      matchStage.date = {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`)
      };
    }
    
    const summary = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
    
    const totalExpenses = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    res.status(200).json({ 
      success: true, 
      data: {
        byCategory: summary,
        total: totalExpenses[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};