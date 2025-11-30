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

// ✅ AUTH PROTECTED SUMMARY (existing)
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    const expenses = await Expense.find({ userId });
    const expenseByCategory = {};
    let totalExpenses = 0;
    
    expenses.forEach(exp => {
      const category = exp.category;
      expenseByCategory[category] = (expenseByCategory[category] || 0) + exp.amount;
      totalExpenses += exp.amount;
    });
    
    res.json({
      income: 0,
      total: totalExpenses,
      expenses: expenseByCategory,
      userId: userId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW: DYNAMIC USER PUBLIC ENDPOINT (ANY USER!)
router.get('/summary/public/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`🔍 SmartBot fetching data for user: ${userId}`);
    
    const expenses = await Expense.find({ userId });
    
    const expenseByCategory = {};
    let totalExpenses = 0;
    
    expenses.forEach(exp => {
      const category = exp.category;
      expenseByCategory[category] = (expenseByCategory[category] || 0) + exp.amount;
      totalExpenses += exp.amount;
    });
    
    const response = {
      userId,
      income: 0,  // Add Income support later
      total: totalExpenses,
      expenses: expenseByCategory,
      count: expenses.length,
      message: `Found ${expenses.length} expenses for ${userId}`
    };
    
    console.log(`✅ ${userId}: Total ₹${totalExpenses.toLocaleString()}, ${Object.keys(expenseByCategory).length} categories`);
    res.json(response);
  } catch (error) {
    console.error(`❌ Error fetching ${req.params.userId}:`, error.message);
    res.status(500).json({ error: error.message, userId: req.params.userId });
  }
});

module.exports = router;
