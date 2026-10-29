const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to DB for seeding');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: env.SEED_ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin already exists. Skipping seed.');
    } else {
      await User.create({
        name: env.SEED_ADMIN_NAME,
        email: env.SEED_ADMIN_EMAIL,
        passwordHash: env.SEED_ADMIN_PASSWORD, // Pre-save hook will hash this!
        role: 'admin',
      });
      console.log('🌱 Admin user created successfully!');
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();