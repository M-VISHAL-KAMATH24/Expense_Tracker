import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'

const Home = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Decode token to get user info (simple version)
      const payload = JSON.parse(atob(token.split('.')[1]))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({ id: payload.userId })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-12'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent'>
              Dashboard
            </h1>
            <p className='text-gray-600 mt-2'>Welcome back! Ready to track expenses?</p>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-500'>Hi, {user ? 'User' : 'Guest'}</span>
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200'
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50'>
            <h3 className='text-sm font-medium text-gray-600 mb-2'>Total Income</h3>
            <p className='text-3xl font-bold text-green-600'>₹0</p>
          </div>
          <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50'>
            <h3 className='text-sm font-medium text-gray-600 mb-2'>Total Expenses</h3>
            <p className='text-3xl font-bold text-red-600'>₹0</p>
          </div>
          <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50'>
            <h3 className='text-sm font-medium text-gray-600 mb-2'>Balance</h3>
            <p className='text-3xl font-bold text-blue-600'>₹0</p>
          </div>
          <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50'>
            <h3 className='text-sm font-medium text-gray-600 mb-2'>Transactions</h3>
            <p className='text-3xl font-bold text-purple-600'>0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Link to='/income' className='group bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300'>
            <h3 className='text-2xl font-bold mb-2 group-hover:scale-105 transition-transform'>+ Add Income</h3>
            <p className='opacity-90'>Record your earnings</p>
          </Link>
          <Link to='/expense' className='group bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300'>
            <h3 className='text-2xl font-bold mb-2 group-hover:scale-105 transition-transform'>+ Add Expense</h3>
            <p className='opacity-90'>Track your spending</p>
          </Link>
          <div className='bg-gradient-to-r from-purple-500 to-violet-600 text-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer'>
            <h3 className='text-2xl font-bold mb-2'>📊 View Reports</h3>
            <p className='opacity-90'>Analytics & insights</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
