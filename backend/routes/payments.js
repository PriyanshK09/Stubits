const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const { sendPaymentConfirmationEmail } = require('../services/emailService');

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

router.post('/payment/confirm', async (req, res) => {
  try {
    const { email, paymentDetails } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail(email, paymentDetails);
      res.status(200).json({ 
        message: 'Payment confirmation email sent successfully' 
      });
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      res.status(500).json({ 
        message: 'Failed to send payment confirmation email' 
      });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;