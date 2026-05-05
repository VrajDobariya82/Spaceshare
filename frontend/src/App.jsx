import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Signup from './components/Signup';
import RenterDashboard from './components/RenterDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/renter-dashboard" element={<ProtectedRoute requiredRole="renter"><RenterDashboard /></ProtectedRoute>} />
            <Route path="/owner-dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
