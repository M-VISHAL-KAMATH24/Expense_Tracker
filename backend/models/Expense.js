const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  amount: { type: Number, required: [true, 'Amount is required'] },
  category: { type: String, required: [true, 'Category is required'] },
  emoji: { type: String, default: '💸' },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User ID is required'] }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
