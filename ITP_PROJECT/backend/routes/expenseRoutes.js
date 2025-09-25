const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} = require('../controllers/expenseController');
const { validateExpense } = require('../middleware/validation');

// Use validation middleware
router.post('/', validateExpense, addExpense);
router.put('/:id', validateExpense, updateExpense);
router.get('/', getExpenses);
router.get('/summary', getExpenseSummary);
router.get('/:id', getExpense);
router.delete('/:id', deleteExpense);

module.exports = router;