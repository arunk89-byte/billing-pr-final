import express from 'express';
import cors from 'cors';
import { connectDB } from '../lib/db';
import authRoutes from './api/auth';
import config from './config';

const app = express();

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/api/test`);
}); 