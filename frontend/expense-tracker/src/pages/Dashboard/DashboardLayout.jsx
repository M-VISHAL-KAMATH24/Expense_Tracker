import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiCreditCard, FiUser, FiZap, FiLogOut } from 'react-icons/fi';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: 'overview', name: 'Dashboard', icon: FiHome },
    { path: 'income', name: 'Income', icon: FiTrendingUp },
    { path: 'expense', name: 'Expense', icon: FiCreditCard },
    { path: 'profile', name: 'Profile', icon: FiUser },
    { path: 'smart-bot', name: 'Smart Bot', icon: FiZap }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-purple-50'>
      {/* Sidebar */}
      <div className='fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-100 z-40'>
        <div className='p-8'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-12'>
            Expense Tracker
          </h1>
          
          {/* Menu Items */}
          <nav className='space-y-2'>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className='w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-200 hover:bg-purple-50 hover:shadow-md group'
              >
                <item.icon className='w-6 h-6 text-gray-600 group-hover:text-purple-600' />
                <span className='font-medium text-gray-800 group-hover:text-purple-600'> {item.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className='w-full flex items-center space-x-4 px-6 py-4 mt-8 rounded-2xl text-left transition-all duration-200 hover:bg-red-50 hover:shadow-md group'
          >
            <FiLogOut className='w-6 h-6 text-red-600' />
            <span className='font-medium text-red-600'>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='ml-64 p-8'>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
