import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'customer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isLoggedIn, userType: currentUserType } = useAuth();

  if (!isLoggedIn) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (currentUserType !== userType) {
    // Wrong user type, redirect to appropriate dashboard
    return <Navigate to={currentUserType === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  // User is authenticated and has the correct type
  return <>{children}</>;
};

export default ProtectedRoute;