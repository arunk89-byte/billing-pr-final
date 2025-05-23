import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'waterbillmanagement123456';

export interface UserData {
  _id?: string;
  name: string;
  email: string;
  password: string;
  username: string;
  rrNumber: string;
  meterNumber: string;
  role?: 'admin' | 'customer';
  address?: string;
  phone?: string;
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user: { _id: string; email: string; role: string }): string => {
  return jwt.sign(
    { 
      _id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
export const registerUser = async (userData: UserData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: userData.email },
        { username: userData.username },
        { rrNumber: userData.rrNumber },
        { meterNumber: userData.meterNumber }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email already registered');
      }
      if (existingUser.username === userData.username) {
        throw new Error('Username already taken');
      }
      if (existingUser.rrNumber === userData.rrNumber) {
        throw new Error('RR Number already registered');
      }
      if (existingUser.meterNumber === userData.meterNumber) {
        throw new Error('Meter Number already registered');
      }
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create new user
    const user = new User({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'customer'
    });

    // Save user to database
    await user.save();

    // Generate token
    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
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
      token
    };
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate token
    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
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
      token
    };
  } catch (error) {
    throw error;
  }
}; 