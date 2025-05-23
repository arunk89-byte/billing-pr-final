import express from 'express';
import { registerUser, loginUser } from '../utils/auth';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      username,
      rrNumber,
      meterNumber,
      address, 
      phone, 
      role 
    } = req.body;
    
    const result = await registerUser({
      name,
      email,
      password,
      username,
      rrNumber,
      meterNumber,
      address,
      phone,
      role
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await loginUser(email, password);
    
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 