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
    setToken(response.token);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
  };

  const login = async (email: string, password: string, role: 'customer' | 'admin' = 'customer'): Promise<boolean> => {
    try {
      // Hardcoded admin credentials check
      if (role === 'admin') {
        if (email === 'admin@waterbill.com' && password === 'admin@123') {
          const adminUser = {
            _id: 'admin-1',
            name: 'Administrator',
            email: 'admin@waterbill.com',
            role: 'admin',
            username: 'admin',
            rrNumber: 'admin-rr',
            meterNumber: 'admin-meter'
          };
          handleAuthResponse({ user: adminUser, token: 'admin-token' });
          toast.success('Admin login successful!');
          return true;
        } else {
          toast.error('Invalid admin credentials');
          return false;
        }
      }

      // Regular customer login through API
      const response = await api.login({ email, password, role });
      handleAuthResponse(response);
      toast.success('Login successful!');
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