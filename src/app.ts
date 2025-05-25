import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './api/auth';
import adminRoutes from './api/admin';
import customerRoutes from './api/customers';

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/waterbilling')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app; 