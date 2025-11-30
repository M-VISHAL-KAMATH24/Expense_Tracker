import React from 'react'
import card2 from '../../assets/images/card2.png'  // ← ADD THIS IMPORT

const AuthLayout = ({children}) => {
  return (
    <div className='w-screen h-screen flex overflow-hidden'>
      {/* Left Side - Form */}
      <div className='w-full md:w-[60vw] px-12 pt-8 pb-12 flex flex-col justify-center'>
        <h2 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2'>
          Expense Tracker
        </h2>
        <p className='text-gray-600 mb-8'>Track your expenses, achieve your goals</p>
        {children}
      </div>

      {/* Right Side - With IMAGE */}
      <div className='hidden md:block w-[40vw] h-screen bg-gradient-to-br from-violet-50 to-purple-50 relative overflow-hidden'>
        {/* Decorative Background */}
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]'/>
        
        {/* Decorative Shapes */}
        <div className='w-48 h-48 rounded-[40px] bg-purple-600/20 absolute -top-7 -left-5 animate-pulse'/>
        <div className='w-48 h-48 rounded-[40px] bg-violet-500/20 absolute -bottom-7 -left-5 animate-pulse'/>

        {/* YOUR IMAGE - Perfect Position */}
        <img 
src={card2}
          alt="Expense Tracker Hero"
          className='w-[85%] h-[65%] object-contain absolute bottom-20 left-1/2 -translate-x-1/2 shadow-2xl shadow-purple-400/30 z-10'
        />
      </div>
    </div>
  )
}

export default AuthLayout
