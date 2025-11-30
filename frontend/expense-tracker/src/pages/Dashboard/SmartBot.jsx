import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const SmartBot = () => {
  const { user, loading } = useAuth();
  const [userId, setUserId] = useState('guest_user');

  useEffect(() => {
    if (!loading && user) {
      const id = user?.id || user?.username || user?.email?.split('@')[0] || 'guest_user';
      setUserId(id);
      console.log('✅ User ID:', id);  // DEBUG
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className='text-center p-8 max-w-md mx-auto'>
          <div style={{width: 60, height: 60, border: '4px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px'}}></div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Loading SmartBot...</h2>
          <p className='text-gray-600'>Analyzing your financial data</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)', padding: 32}}>
      <div style={{maxWidth: 1200, margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: 48}}>
          <div style={{width: 112, height: 112, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 20px 40px rgba(139,92,246,0.3)'}}>
            <span style={{fontSize: 48, color: 'white'}}>🤖</span>
          </div>
          <h1 style={{fontSize: 48, fontWeight: 'bold', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16}}>
            SmartBot AI
          </h1>
          <p style={{fontSize: 20, color: '#6b7280', marginBottom: 8}}>
            Analyzing <strong>{userId}</strong>'s expenses
          </p>
        </div>

        {/* IFRAME */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 32}}>
          <iframe
            src={`http://localhost:8001/?userId=${encodeURIComponent(userId)}`}
            style={{width: '100%', height: 700, borderRadius: 24, border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', background: 'white'}}
            title={`SmartBot for ${userId}`}
            onLoad={() => console.log('✅ SmartBot iframe loaded')}
            onError={(e) => console.error('❌ SmartBot iframe error:', e)}
          />
          
          {/* Status */}
          <div style={{background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.5)', textAlign: 'center'}}>
            <h3 style={{fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 16}}>🔗 Status</h3>
            <p>User: <strong>{userId}</strong></p>
            <p>Backend: <span style={{color: '#10b981'}}>localhost:5000</span></p>
            <p>SmartBot: <span style={{color: '#3b82f6'}}>localhost:8001</span></p>
            <a href={`http://localhost:8001/?userId=${userId}`} target="_blank" style={{color: '#8b5cf6', textDecoration: 'none'}}>🔗 Open Direct</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBot;
