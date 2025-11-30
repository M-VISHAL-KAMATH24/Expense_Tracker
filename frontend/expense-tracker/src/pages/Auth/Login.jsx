import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'  // ✅ Added
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ✅ REAL API CALL
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })
      
      // ✅ Save REAL JWT token
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6'>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50'
            placeholder='Enter your email'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50'
              placeholder='Enter your password'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors'
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-violet-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
        >
          {loading ? (
            <>
              <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'/>
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <p className='text-center mt-8 text-sm text-gray-600'>
        Don't have an account?{' '}
        <Link to='/signup' className='font-semibold text-purple-600 hover:text-purple-700 transition-colors'>
          Sign up here
        </Link>
      </p>
    </div>
  )
}

export default Login
