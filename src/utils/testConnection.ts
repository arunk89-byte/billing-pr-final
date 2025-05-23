import mongoose from 'mongoose';

// Set the MongoDB URI directly for testing
process.env.MONGODB_URI = 'mongodb+srv://arunkumbar2468:246813579arU%40@cluster0.nqp3o8q.mongodb.net/?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');

    // Test creating a user
    const userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
      },
      rrNumber: {
        type: String,
        required: true,
        unique: true
      },
      meterNumber: {
        type: String,
        required: true,
        unique: true
      },
      address: String,
      phone: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    // Create the model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
      rrNumber: 'RR123',
      meterNumber: 'MT123',
      address: 'Test Address',
      phone: '1234567890'
    });

    // Save the user
    await testUser.save();
    console.log('Test user created successfully!');

    // Find the user
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('Found test user:', foundUser);

    // Delete the test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Test user deleted successfully!');

    // Close the connection
    await mongoose.disconnect();
    console.log('Connection closed successfully!');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testConnection(); 