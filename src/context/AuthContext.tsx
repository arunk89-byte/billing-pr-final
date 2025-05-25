import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { api, RegisterData, LoginData, AuthResponse } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  rrNumber: string;
  meterNumber: string;
  address?: string;
  phone?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userType: 'customer' | 'admin' | null;
  login: (email: string, password: string, role?: 'customer' | 'admin') => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isLoggedIn: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get stored auth data from localStorage
const getStoredAuth = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stored = getStoredAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [isLoggedIn, setIsLoggedIn] = useState(!!stored.token);

  const handleAuthResponse = (response: AuthResponse) => {
    setCurrentUser(response.user);
    // Ensure token has Bearer prefix
    const authToken = response.token.startsWith('Bearer ') ? response.token : `Bearer ${response.token}`;
    setToken(authToken);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', authToken);
  };

  const login = async (email: string, password: string, role: 'customer' | 'admin' = 'customer'): Promise<boolean> => {
    try {
      // Use the API for both admin and customer login
      const response = await api.login({ email, password, role });
      handleAuthResponse(response);
      toast.success(`${role === 'admin' ? 'Admin' : 'Customer'} login successful!`);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      await api.register(userData);
      // Don't automatically log in the user after registration
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const userType = currentUser?.role === 'admin' ? 'admin' : 'customer';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userType,
        login,
        logout,
        register,
        isLoggedIn,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};