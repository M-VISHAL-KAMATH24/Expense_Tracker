const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🔍 MONGO_URI:', process.env.MONGO_URI?.substring(0, 50) + '...');

const authRoutes = require('./routes/auth');
const incomeRoutes = require('./routes/income');
const expenseRoutes = require('./routes/expense');
const profileRoutes = require('./routes/profile');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes); 
app.use('/api/expense', expenseRoutes);
app.use('/api/profile', profileRoutes);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // ✅ NO DEPRECATED OPTIONS!
    console.log('✅ MongoDB Connected!');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
