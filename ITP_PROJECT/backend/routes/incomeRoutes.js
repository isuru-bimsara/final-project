const express = require('express');
const router = express.Router();
const {
  addIncome,
  getIncomes,
  getIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary
} = require('../controllers/incomeController');
const { validateIncome } = require('../middleware/validation');

// Use validation middleware
router.post('/', validateIncome, addIncome);
router.put('/:id', validateIncome, updateIncome);
router.get('/', getIncomes);
router.get('/summary', getIncomeSummary);
router.get('/:id', getIncome);
router.delete('/:id', deleteIncome);

module.exports = router;