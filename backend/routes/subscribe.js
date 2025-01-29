const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { sendThankYouEmail } = require('../services/emailService');

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Save subscriber first
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    try {
      // Attempt to send email
      await sendThankYouEmail(email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Email failed but user is subscribed
      return res.status(201).json({ 
        message: 'Subscribed successfully! (Email confirmation may be delayed)' 
      });
    }

    // Both operations succeeded
    res.status(201).json({ 
      message: 'Thanks for subscribing! Check your email for confirmation.' 
    });

  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'This email is already registered!' 
      });
    }
    console.error('Subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to subscribe. Please try again.' 
    });
  }
});

// New GET route for subscribers list
router.get('/subscribers', async (req, res) => {
  try {
    const { password } = req.query;
    
    // Check admin password
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ 
        message: 'Unauthorized access' 
      });
    }

    // Fetch subscribers sorted by newest first
    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 })
      .select('email subscribedAt _id');

    res.status(200).json(subscribers);

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ 
      message: 'Failed to fetch subscribers' 
    });
  }
});

module.exports = router;