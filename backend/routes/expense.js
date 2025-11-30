const express = require('express');
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ YOUR EXISTING ROUTES (UNCHANGED)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ NEW SUMMARY ENDPOINT (auth protected)
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get expenses by category
    const expenses = await Expense.find({ userId });
    const expenseByCategory = {};
    let totalExpenses = 0;
    
    expenses.forEach(exp => {
      const category = exp.category;
      expenseByCategory[category] = (expenseByCategory[category] || 0) + exp.amount;
      totalExpenses += exp.amount;
    });
    
    // Default income = 0 (until income.js is added)
    const income = 0;
    
    res.json({
      income,
      total: totalExpenses,
      expenses: expenseByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
