/**
 * MongoDB Database Configuration
 * MongoDB is optional - only connects if MONGODB_URI is provided
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip MongoDB connection if URI is not provided
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  MONGODB_URI not configured - skipping MongoDB connection');
    console.log('📝 Running in stateless mode (no user authentication/persistence)');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Ensure email uniqueness is enforced even if automatic index creation is disabled.
    try {
      await mongoose.connection.db.collection('users').createIndex(
        { email: 1 },
        {
          unique: true,
          name: 'unique_email_ci',
          collation: { locale: 'en', strength: 2 },
        }
      );
      console.log('✅ Ensured unique email index (case-insensitive)');
    } catch (indexError) {
      console.warn('⚠️ Could not ensure unique email index:', indexError.message);
    }

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = connectDB;
