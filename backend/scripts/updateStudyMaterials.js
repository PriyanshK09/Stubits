// Create a migration script: /backend/scripts/updateStudyMaterials.js

const mongoose = require('mongoose');
require('dotenv').config();

const StudyMaterial = require('../models/StudyMaterial');

const updateStudyMaterials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing documents to include isHidden field
    const result = await StudyMaterial.updateMany(
      { isHidden: { $exists: false } }, // Find documents where isHidden doesn't exist
      { $set: { isHidden: false } },    // Set isHidden to false for all existing materials
      { multi: true }                    // Update multiple documents
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

updateStudyMaterials();