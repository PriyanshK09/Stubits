const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { checkAdmin } = require('../middleware/auth');

// Create donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
});

// Get all donations (admin only)
router.get('/all', checkAdmin, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

// Update donation status (admin only)
router.patch('/:id', checkAdmin, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating donation status' });
  }
});

module.exports = router;