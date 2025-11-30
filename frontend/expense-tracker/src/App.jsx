import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';  // ✅ .jsx
import AuthLayout from './components/layouts/AuthLayout';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Overview from './pages/Dashboard/Overview';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Profile from './pages/Dashboard/Profile';
import SmartBot from './pages/Dashboard/SmartBot';

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />  {/* ✅ FIXED! */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="income" element={<Income />} />
            <Route path="expense" element={<Expense />} />
            <Route path="profile" element={<Profile />} />
            <Route path="smart-bot" element={<SmartBot />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
