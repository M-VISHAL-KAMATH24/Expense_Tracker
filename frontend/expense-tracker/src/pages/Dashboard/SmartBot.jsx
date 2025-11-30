import React from 'react';
import { FiZap } from 'react-icons/fi';

const SmartBot = () => (
  <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-8'>
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='w-28 h-28 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl'>
          <FiZap className='text-4xl text-white' />
        </div>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4'>
          SmartBot AI + Database
        </h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Connected to your expenses + Gemini 2.0 Flash
        </p>
      </div>

      {/* SmartBot Chat IFRAME */}
      <div className='grid lg:grid-cols-2 gap-8 items-start'>
        <iframe
          src="http://localhost:8001"
          className='w-full h-[700px] rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-xl lg:col-span-1'
          title="SmartBot AI Chat - Connected to Database"
        />
        
        <div className='space-y-6 lg:order-1 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50'>
          <h3 className='text-3xl font-bold text-gray-900 mb-4'>🚀 Auto-Analyzes Your Data:</h3>
          
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/50'>
              <h4 className='text-xl font-bold text-emerald-800 mb-3'>📊 Database Data</h4>
              <ul className='space-y-2 text-emerald-700'>
                <li>• Auto-fetches expenses</li>
                <li>• Income totals</li>
                <li>• Category breakdown</li>
              </ul>
            </div>
            
            <div className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50'>
              <h4 className='text-xl font-bold text-blue-800 mb-3'>💬 Chat Analysis</h4>
              <ul className='space-y-2 text-blue-700'>
                <li>• "Rent ₹12000" → extracts</li>
                <li>• Combined totals</li>
                <li>• Smart recommendations</li>
              </ul>
            </div>
          </div>
          
          <div className='p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50'>
            <h4 className='text-xl font-bold text-purple-800 mb-3'>🔗 Connected To:</h4>
            <div className='flex flex-wrap gap-3 text-sm'>
              <span className='px-3 py-1 bg-white/80 rounded-full text-purple-700 font-medium'>Backend API</span>
              <span className='px-3 py-1 bg-white/80 rounded-full text-pink-700 font-medium'>Gemini 2.0</span>
              <span className='px-3 py-1 bg-white/80 rounded-full text-emerald-700 font-medium'>Your Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SmartBot;
