// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');

// Middleware to check admin auth
const checkAdmin = (req, res, next) => {
  const { adminKey } = req.headers;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Add verify route
router.post('/verify', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ 
      message: 'Authentication successful',
      token: password // In production, use proper JWT
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add change password route
router.post('/change-password', checkAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password in env (in production, use proper DB)
    process.env.ADMIN_PASSWORD = newPassword;
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all materials
router.get('/materials', checkAdmin, async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials' });
  }
});

// Add new material
router.post('/materials', checkAdmin, async (req, res) => {
  try {
    const material = new StudyMaterial(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error creating material' });
  }
});

// Update material
router.put('/materials/:id', checkAdmin, async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error updating material' });
  }
});

// Delete material
router.delete('/materials/:id', checkAdmin, async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting material' });
  }
});

module.exports = router;