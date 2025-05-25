import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../lib/db';
import config from '../config';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email?: string;
    role?: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Remove 'Bearer ' prefix if it exists
      token = req.headers.authorization.replace('Bearer ', '');
      console.log('Extracted token:', token);
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      console.log('Verifying token with secret:', config.jwt.secret);
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as { _id: string; email: string; role: string };
      console.log('Decoded token:', decoded);

      // For admin token
      if (decoded.role === 'admin') {
        console.log('Admin user authenticated');
        req.user = {
          _id: decoded._id,
          email: decoded.email,
          role: 'admin'
        };
        return next();
      }

      // For regular users, get user from database
      console.log('Looking up user in database:', decoded._id);
      const user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        console.log('No user found in database');
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('User found:', user);
      req.user = {
        _id: user._id.toString(),
        email: user.email,
        role: user.role
      };
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
}; 