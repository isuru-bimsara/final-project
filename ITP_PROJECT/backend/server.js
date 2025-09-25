const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Expense = require('./models/expenseModel');
const Income = require('./models/incomeModel');
const Salary = require('./models/salaryModel');

// Import routes
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const taxRoutes = require('./routes/taxRoutes');

// Import database connection
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/taxes', taxRoutes);

// Finance API Endpoints
app.get('/api/finance/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Calculate date range (default to last 30 days)
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    // Set time to beginning/end of day for proper date comparison
    const start = startDate ? new Date(startDate) : defaultStartDate;
    start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : defaultEndDate;
    end.setHours(23, 59, 59, 999);
    
    const filter = {
      date: {
        $gte: start,
        $lte: end
      }
    };
    
    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get total incomes
    const totalIncomes = await Income.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalExpenses: totalExpenses[0]?.total || 0,
        totalIncomes: totalIncomes[0]?.total || 0,
        netProfit: (totalIncomes[0]?.total || 0) - (totalExpenses[0]?.total || 0)
      }
    });
  } catch (error) {
    console.error('Error in finance summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching finance summary',
      error: error.message 
    });
  }
});

app.get('/api/finance/kpis', async (req, res) => {
  try {
    // Calculate date ranges for comparison
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
    // Set time for proper date comparison
    currentMonthStart.setHours(0, 0, 0, 0);
    previousMonthStart.setHours(0, 0, 0, 0);
    previousMonthEnd.setHours(23, 59, 59, 999);
    currentDate.setHours(23, 59, 59, 999);
    
    // Current month totals
    const currentExpenses = await Expense.aggregate([
      { $match: { date: { $gte: currentMonthStart, $lte: currentDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const currentIncomes = await Income.aggregate([
      { $match: { date: { $gte: currentMonthStart, $lte: currentDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Previous month totals
    const previousExpenses = await Expense.aggregate([
      { $match: { date: { $gte: previousMonthStart, $lte: previousMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const previousIncomes = await Income.aggregate([
      { $match: { date: { $gte: previousMonthStart, $lte: previousMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Employee count (from salaries)
    const employeeCount = await Salary.distinct('employeeName').countDocuments();
    
    // Calculate growth percentages
    const currentExpenseTotal = currentExpenses[0]?.total || 0;
    const previousExpenseTotal = previousExpenses[0]?.total || 0;
    const expenseGrowth = previousExpenseTotal > 0 
      ? ((currentExpenseTotal - previousExpenseTotal) / previousExpenseTotal) * 100 
      : currentExpenseTotal > 0 ? 100 : 0;
    
    const currentIncomeTotal = currentIncomes[0]?.total || 0;
    const previousIncomeTotal = previousIncomes[0]?.total || 0;
    const incomeGrowth = previousIncomeTotal > 0 
      ? ((currentIncomeTotal - previousIncomeTotal) / previousIncomeTotal) * 100 
      : currentIncomeTotal > 0 ? 100 : 0;
    
    const profit = currentIncomeTotal - currentExpenseTotal;
    const profitMargin = currentIncomeTotal > 0 ? (profit / currentIncomeTotal) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        revenue: currentIncomeTotal,
        revenueGrowth: parseFloat(incomeGrowth.toFixed(2)),
        expenses: currentExpenseTotal,
        expensesGrowth: parseFloat(expenseGrowth.toFixed(2)),
        employees: employeeCount,
        profit: profit,
        profitMargin: parseFloat(profitMargin.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error in finance KPIs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching finance KPIs',
      error: error.message 
    });
  }
});

app.get('/api/finance/monthly', async (req, res) => {
  try {
    // Get data for last 12 months
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      
      // Set time for proper date comparison
      monthStart.setHours(0, 0, 0, 0);
      monthEnd.setHours(23, 59, 59, 999);
      
      const monthExpenses = await Expense.aggregate([
        { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const monthIncomes = await Income.aggregate([
        { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: monthIncomes[0]?.total || 0,
        expenses: monthExpenses[0]?.total || 0
      });
    }
    
    res.json({ success: true, data: monthlyData });
  } catch (error) {
    console.error('Error in monthly finance data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching monthly finance data',
      error: error.message 
    });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Garment Factory Finance Management API' });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});