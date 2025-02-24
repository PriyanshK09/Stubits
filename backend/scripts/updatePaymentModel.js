const mongoose = require('mongoose');
require('dotenv').config();

const Payment = require('../models/Payment');

const updatePayments = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing documents to include screenshot field
    const result = await Payment.updateMany(
      { screenshot: { $exists: false } }, // Find payments without screenshot field
      { $set: { screenshot: null } },     // Set screenshot to null for existing payments
      { multi: true }                     // Update multiple documents
    );

    console.log(`Updated ${result.modifiedCount} payments`);

    // Verify update
    const pendingPayments = await Payment.find({ status: 'pending' });
    console.log(`Total pending payments: ${pendingPayments.length}`);
    console.log('Sample payment after update:', pendingPayments[0]);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

// Run the migration
updatePayments();