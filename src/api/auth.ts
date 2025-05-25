import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../lib/db';
import config from '../config';
import { registerUser, loginUser } from '../utils/auth';

const router = express.Router();

// Admin credentials
const ADMIN_EMAIL = 'admin@waterbill.com';
const ADMIN_PASSWORD = 'admin@123';

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role });

    // Admin login
    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log('Admin login successful');
        const adminUser = {
          _id: 'admin-1',
          name: 'Administrator',
          email: ADMIN_EMAIL,
          role: 'admin',
          username: 'admin',
          rrNumber: 'admin-rr',
          meterNumber: 'admin-meter'
        };

        const token = jwt.sign(
          { _id: adminUser._id, email: adminUser.email, role: 'admin' },
          config.jwt.secret,
          { expiresIn: '7d' }
        );

        console.log('Generated admin token:', token.substring(0, 20) + '...');
        return res.json({
          user: adminUser,
          token: `Bearer ${token}`
        });
      } else {
        console.log('Admin login failed');
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // Regular user login
    console.log('Attempting regular user login');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    console.log('Generated user token:', token.substring(0, 20) + '...');
    console.log('User login successful:', {
      userId: user._id,
      role: user.role
    });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        rrNumber: user.rrNumber,
        meterNumber: user.meterNumber,
        address: user.address,
        phone: user.phone
      },
      token: `Bearer ${token}`
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
});

export default router; 