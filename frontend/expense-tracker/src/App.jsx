import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import AuthLayout from './components/layouts/AuthLayout';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';  // ✅ Added

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route 
          path="/login" 
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route 
          path="/signup" 
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
