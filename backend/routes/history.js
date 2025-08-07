const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Prediction = require('../models/Prediction');

// @route   GET api/history
// @desc    Get user's prediction history
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await Prediction.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: Route to clear history ---
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
// --- END ---

module.exports = router;