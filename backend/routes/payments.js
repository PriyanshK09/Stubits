const router = require('express').Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// Create new payment
router.post('/', auth, async (req, res) => {
  try {
    console.log('Payment request body:', req.body); // Debug log

    const payment = new Payment({
      userId: req.userId,
      materialId: req.body.materialId,
      amount: req.body.amount,
      userUpi: req.body.userUpi,
      status: 'pending'
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      message: 'Error creating payment',
      error: error.message 
    });
  }
});

// Get user's payments
router.get('/my', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate('materialId')
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

module.exports = router;