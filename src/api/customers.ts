import express, { Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth';
import { User } from '../../lib/db';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    role?: string;
  };
}

const router = express.Router();

// @route   GET /api/customers/:id
// @desc    Get customer data including previous reading
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    // Allow both the customer themselves and admins to access the data
    if (!req.user || (req.user._id.toString() !== id && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to access this data' });
      return;
    }

    const customer = await User.findById(id).select('name email previousReading meterNumber rrNumber');
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Return customer data with previous reading
    res.json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      previousReading: customer.previousReading || 0,
      meterNumber: customer.meterNumber,
      rrNumber: customer.rrNumber
    });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

export default router; 