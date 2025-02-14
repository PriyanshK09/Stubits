// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');
const Payment = require('../models/Payment');
const User = require('../models/User'); // Add this import
const { sendPaymentStatusEmail } = require('../services/emailService');

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

// Get all payments
router.get('/payments', checkAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('materialId')
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// Update payment status
router.patch('/payments/:id', checkAdmin, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    .populate('userId')
    .populate('materialId');

    // Send email notification
    await sendPaymentStatusEmail(
      payment.userId.email,
      payment.userId.name,
      payment.materialId.title,
      payment.status,
      payment.amount
    );

    res.json(payment);
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ message: 'Error updating payment' });
  }
});

router.get('/stats', checkAdmin, async (req, res) => {
  try {
    const { timeRange } = req.query;
    let dateFilter = {};
    
    // Calculate date range based on filter
    switch(timeRange) {
      case 'week':
        dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {}; // all time
    }

    // Base match for all queries
    const baseMatch = { 
      status: 'approved',
      ...dateFilter 
    };

    // Get basic stats
    const totalRevenue = await Payment.aggregate([
      { $match: baseMatch },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSales = await Payment.countDocuments(baseMatch);
    const activeCustomers = await Payment.distinct('userId', baseMatch);

    // Get top notes
    const topNotes = await Payment.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$materialId',
          sales: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'studymaterials',
          localField: '_id',
          foreignField: '_id',
          as: 'material'
        }
      },
      { $unwind: '$material' },
      {
        $project: {
          title: '$material.title',
          sales: 1,
          revenue: 1
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // Sales distribution
    const salesDistribution = await Payment.aggregate([
      { $match: baseMatch },
      {
        $lookup: {
          from: 'studymaterials',
          localField: 'materialId',
          foreignField: '_id',
          as: 'material'
        }
      },
      { $unwind: '$material' },
      {
        $group: {
          _id: '$material.category',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0
        }
      }
    ]);

    // Revenue trend
    const revenueTrend = await Payment.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          date: '$_id',
          amount: 1,
          _id: 0
        }
      }
    ]);

    const responseData = {
      overview: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalSales: totalSales || 0,
        activeCustomers: activeCustomers?.length || 0,
        averageOrderValue: totalSales ? (totalRevenue[0]?.total || 0) / totalSales : 0
      },
      topNotes: topNotes || [],
      salesDistribution: salesDistribution || [],
      revenueTrend: revenueTrend || [],
      timeRange
    };

    res.json(responseData);

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;