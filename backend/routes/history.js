const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Prediction = require('../models/Prediction');

// @route   GET /api/history
// @desc    Get all predictions for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await Prediction.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']], // Show the most recent first
    });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;