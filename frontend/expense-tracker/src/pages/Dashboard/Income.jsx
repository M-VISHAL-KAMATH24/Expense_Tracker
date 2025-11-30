import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrendingUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Income = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'salary' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Categories with gradients - FIXED text display
  const categories = [
    { id: 'salary', name: 'Salary', emoji: '💼', color: '#10B981' },
    { id: 'freelance', name: 'Freelance', emoji: '💻', color: '#3B82F6' },
    { id: 'business', name: 'Business', emoji: '🏢', color: '#F59E0B' },
    { id: 'investment', name: 'Investment', emoji: '📈', color: '#8B5CF6' },
    { id: 'gift', name: 'Other', emoji: '🎁', color: '#EF4444' }
  ];

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/income', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomes(res.data);
    } catch (error) {
      toast.error('Failed to load incomes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const finalData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        emoji: categories.find(cat => cat.id === formData.category)?.emoji || '💰'
      };
      
      await axios.post('http://localhost:5000/api/income', finalData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Income added successfully! 🎉');
      setFormData({ title: '', amount: '', category: 'salary' });
      fetchIncomes();
    } catch (error) {
      toast.error('Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Income deleted!');
      fetchIncomes();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // FIXED Chart Data
  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  
  const pieData = categories
    .map(cat => {
      const total = incomes.filter(i => i.category === cat.id).reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
      return total > 0 ? { name: cat.name, value: total, fill: cat.color } : null;
    })
    .filter(Boolean);

  // FIXED Monthly Chart Data
  const getMonthlyData = () => {
    const monthlyData = {};
    incomes.forEach(income => {
      const date = new Date(income.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + parseFloat(income.amount || 0);
    });
    return Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a + ' 1') - new Date(b + ' 1'))
      .slice(-6)
      .map(([month, amount]) => ({ month, amount: Math.round(amount) }));
  };

  const barData = getMonthlyData();
  const COLORS = ['#10B981', '#059669', '#047857', '#34D399', '#6EE7B7', '#D1FAE5'];

  return (
    <div className='space-y-8'>
      <Toaster position='top-right' />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex justify-between items-center'
      >
        <h2 className='text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center space-x-4'>
          <FiTrendingUp size={40} />
          <span>Income</span>
        </h2>
        <div className='text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg'>
          ₹{totalIncome.toLocaleString()}
        </div>
      </motion.div>

      {/* Add Income Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-white/20 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500'
      >
        <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 flex items-center space-x-3'>
          <FiPlus size={28} />
          <span>Add New Income</span>
        </h3>
        
        <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <label className='block text-lg font-semibold text-gray-700'>Title</label>
            <input
              type='text'
              placeholder='e.g. Monthly Salary, Freelance Project'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className='w-full px-6 py-5 text-lg rounded-2xl border-2 border-gray-200/50 bg-gradient-to-r from-white/80 to-gray-50/80 focus:ring-4 focus:ring-green-500/20 focus:border-green-500/50 shadow-lg hover:shadow-xl transition-all duration-300'
              required
            />
          </div>

          <div className='space-y-4'>
            <label className='block text-lg font-semibold text-gray-700'>Amount</label>
            <input
              type='number'
              placeholder='5000'
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className='w-full px-6 py-5 text-lg rounded-2xl border-2 border-gray-200/50 bg-gradient-to-r from-emerald-50/80 to-green-50/80 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-lg hover:shadow-xl transition-all duration-300'
              required
            />
          </div>

          <div className='lg:col-span-2 space-y-4'>
            <label className='block text-lg font-semibold text-gray-700'>Category</label>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
              {categories.map((cat) => {
                const isActive = formData.category === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type='button'
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-5 rounded-2xl border-2 font-semibold flex flex-col items-center space-y-2 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500/50 shadow-emerald-500/25 text-white scale-105 ring-4 ring-emerald-500/30'
                        : 'bg-white/80 border-gray-200/50 hover:border-emerald-300/70 hover:bg-emerald-50/50 text-gray-800'
                    }`}
                  >
                    <span className='text-3xl z-10 relative'>{cat.emoji}</span>
                    <span className='text-sm font-bold z-10 relative whitespace-nowrap'>{cat.name}</span>
                    {isActive && (
                      <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-600/20 blur-xl animate-pulse' />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className='w-full bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white py-6 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3 mt-4'
            >
              <FiPlus size={28} />
              <span>{loading ? 'Adding Income...' : 'Add Income'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Charts & List */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl'
        >
          <h3 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6'>
            Income by Category
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  cornerRadius={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className='h-80 flex flex-col items-center justify-center text-gray-500'>
              <FiTrendingUp className='text-6xl mb-4 opacity-50' />
              <p className='text-lg'>Add incomes to see distribution</p>
            </div>
          )}
        </motion.div>

        {/* Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl'
        >
          <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6'>
            Monthly Income Trend
          </h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className='h-80 flex flex-col items-center justify-center text-gray-500'>
              <FiTrendingUp className='text-6xl mb-4 opacity-50' />
              <p className='text-lg'>Add incomes to see monthly trends</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Incomes */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl overflow-hidden'
      >
        <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8'>
          Recent Incomes ({incomes.length})
        </h3>
        
        <AnimatePresence>
          {incomes.slice(0, 5).map((income, index) => {
            const cat = categories.find(c => c.id === income.category);
            return (
              <motion.div
                key={income._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.1 }}
                className='flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 border border-emerald-200/50 hover:border-emerald-300/70 transition-all duration-300 mb-4 group'
              >
                <div className='flex items-center space-x-4 flex-1'>
                  <div className='p-3 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-2xl backdrop-blur-sm border border-emerald-200/30'>
                    <span className='text-3xl'>{income.emoji || cat?.emoji || '💰'}</span>
                  </div>
                  <div>
                    <p className='font-bold text-xl text-gray-900 group-hover:text-emerald-900 transition-colors'>{income.title}</p>
                    <p className='text-sm text-gray-600 flex items-center space-x-2'>
                      <span>{cat?.emoji}</span>
                      <span>{cat?.name || income.category}</span>
                    </p>
                  </div>
                </div>
                <div className='text-right space-y-1'>
                  <p className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent drop-shadow-lg'>
                    ₹{parseFloat(income.amount).toLocaleString()}
                  </p>
                  <button
                    onClick={() => deleteIncome(income._id)}
                    className='p-2 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all group-hover:scale-110'
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {incomes.length === 0 && (
          <div className='text-center py-20'>
            <FiTrendingUp className='mx-auto text-6xl text-gray-300 mb-4' />
            <h4 className='text-2xl font-bold text-gray-500 mb-2'>No incomes yet</h4>
            <p className='text-gray-400'>Add your first income to get started!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Income;
