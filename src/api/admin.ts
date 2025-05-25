import express from 'express';
import { protect } from '../middleware/auth';
import { User } from '../../lib/db';
import { Bill } from '../../lib/db';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// @route   GET /api/admin/customers
// @desc    Get all customers
// @access  Admin only
router.get('/customers', protect, isAdmin, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch customers' });
  }
});

// @route   DELETE /api/admin/customers/delete
// @desc    Delete multiple customers
// @access  Admin only
router.delete('/customers/delete', protect, isAdmin, async (req, res) => {
  try {
    const { customerIds } = req.body;

    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({ message: 'No customer IDs provided' });
    }

    // Delete customers and their associated bills
    await User.deleteMany({ _id: { $in: customerIds }, role: 'customer' });

    // Delete all bills associated with these customers
    await Bill.deleteMany({ customerId: { $in: customerIds } });

    res.json({ message: 'Customers and their bills deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete customers' });
  }
});

export default router; 