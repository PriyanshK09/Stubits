const router = require('express').Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Add screenshot upload route
router.post('/:id/screenshot', auth, upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert file to base64
    const screenshot = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { screenshot },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading screenshot' });
  }
});

module.exports = router;