const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');

router.get('/materials', async (req, res) => {
  try {
    const materials = await StudyMaterial.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ message: 'Error fetching materials' });
  }
});

module.exports = router;