import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Validate and export environment variables
const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://arunkumbar2468:246813579arU%40@cluster0.nqp3o8q.mongodb.net/?retryWrites=true&w=majority'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'waterbillmanagement123456'
  },
  server: {
    port: process.env.PORT || 5000
  }
};

// Log config for debugging (remove in production)
console.log('Configuration loaded:', {
  mongodbUri: config.mongodb.uri ? 'Set' : 'Not Set',
  jwtSecret: config.jwt.secret ? 'Set' : 'Not Set',
  port: config.server.port
});

export default config; 