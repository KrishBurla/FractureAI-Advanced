const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // Import the 'Op' operator for searching
const authMiddleware = require('../middleware/authMiddleware');
const Prediction = require('../models/Prediction');

// @route   GET api/history
// @desc    Get user's prediction history (with optional search)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.query; // Look for a patientId in the query string
    
    const whereClause = {
      UserId: req.user.id,
    };

    // If a patientId is provided, add it to the search criteria
    if (patientId) {
      whereClause.patientId = {
        [Op.like]: `%${patientId}%` // Use a 'like' query for partial matches
      };
    }

    const history = await Prediction.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/history
// @desc    Delete all prediction history for a user
// @access  Private
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await Prediction.destroy({
      where: {
        UserId: req.user.id,
      },
    });
    res.json({ msg: 'History cleared successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;