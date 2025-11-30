import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Overview = () => {
  const pieData = [
    { name: 'Food', value: 400, color: '#EF4444' },
    { name: 'Transport', value: 300, color: '#3B82F6' },
    { name: 'Shopping', value: 200, color: '#10B981' },
    { name: 'Entertainment', value: 278, color: '#F59E0B' },
  ];

  const barData = [
    { month: 'Jan', income: 4000, expense: 2400 },
    { month: 'Feb', income: 3000, expense: 2210 },
    { month: 'Mar', income: 2000, expense: 1800 },
    { month: 'Apr', income: 2780, expense: 1900 },
  ];

  return (
    <div className='space-y-8'>
      <h2 className='text-3xl font-bold text-gray-900'>Overview</h2>
      
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-sm font-medium text-gray-600 mb-2'>Total Income</h3>
          <p className='text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent'>₹12,780</p>
        </div>
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-sm font-medium text-gray-600 mb-2'>Total Expenses</h3>
          <p className='text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent'>₹8,310</p>
        </div>
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-sm font-medium text-gray-600 mb-2'>Balance</h3>
          <p className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent'>₹4,470</p>
        </div>
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-sm font-medium text-gray-600 mb-2'>Transactions</h3>
          <p className='text-4xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent'>24</p>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} cornerRadius={8}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
