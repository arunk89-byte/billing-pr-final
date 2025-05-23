import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { BillingProvider } from './context/BillingContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Customer Components
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProfilePage from './components/customer/ProfilePage';
import BillCalculator from './components/customer/BillCalculator';
import PaymentPage from './components/customer/PaymentPage';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerList from './components/admin/CustomerList';
import TariffManagement from './components/admin/TariffManagement';

// Protected Route Component
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BillingProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Customer Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute userType="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute userType="customer">
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/billing" 
                  element={
                    <ProtectedRoute userType="customer">
                      <BillCalculator />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment/:billId" 
                  element={
                    <ProtectedRoute userType="customer">
                      <PaymentPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute userType="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/customers" 
                  element={
                    <ProtectedRoute userType="admin">
                      <CustomerList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/tariffs" 
                  element={
                    <ProtectedRoute userType="admin">
                      <TariffManagement />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback Routes */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </BillingProvider>
    </AuthProvider>
  );
}

export default App;