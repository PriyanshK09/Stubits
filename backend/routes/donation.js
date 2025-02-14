const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Import checkAdmin middleware directly
const checkAdmin = (req, res, next) => {
  const { adminKey } = req.headers;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

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

// Add this new route
router.get('/stats', async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: 'approved' });
    const donations = await Donation.find({ status: 'approved' });
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const recentDonations = await Donation.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount createdAt');

    res.json({
      totalDonations,
      totalAmount,
      recentDonations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation statistics' });
  }
});

module.exports = router;