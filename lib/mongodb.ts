import mongoose from 'mongoose';
import config from '../src/config';

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

const MONGODB_URI = config.mongodb.uri;

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null
  };
}

async function connectDB(): Promise<mongoose.Mongoose> {
  try {
    if (global.mongoose.conn) {
      console.log('Using existing MongoDB connection');
      return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
      console.log('Creating new MongoDB connection');
      const opts = {
        bufferCommands: true,
      };

      global.mongoose.promise = mongoose.connect(MONGODB_URI);
    }

    try {
      global.mongoose.conn = await global.mongoose.promise;
      console.log('MongoDB connected successfully');
      return global.mongoose.conn;
    } catch (e) {
      global.mongoose.promise = null;
      console.error('MongoDB connection error:', e);
      throw e;
    }
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

export default connectDB; 