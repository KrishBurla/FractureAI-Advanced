const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const sendPredictionEmail = require('../utils/sendEmail');
const Prediction = require('../models/Prediction'); // Make sure this is imported

const router = express.Router();

// Using a simpler multer setup for storing in 'uploads/'
const upload = multer({ dest: 'uploads/' });

router.post('/', [authMiddleware, upload.single('image')], (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imagePath = req.file.path;
    const pythonProcess = spawn('python', ['predict.py', imagePath]);

    let predictionData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => { predictionData += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { errorData += data.toString(); });

    pythonProcess.on('close', async (code) => {
        try {
            const result = JSON.parse(predictionData);
            try {
  // Construct the full public URL for the image
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  await Prediction.create({
    imagePath: imageUrl, // Save the full URL
    result: result.prediction,
    confidence: result.confidence,
    UserId: req.user.id,
  });
} catch (dbError) {
  console.error("Failed to save prediction to database:", dbError);
}
            // --- SAVE PREDICTION TO DATABASE ---
            try {
                await Prediction.create({
                    imagePath: req.file.path,
                    result: result.prediction,
                    confidence: result.confidence,
                    UserId: req.user.id, // Link it to the logged-in user
                });
            } catch (dbError) {
                console.error("Failed to save prediction to database:", dbError);
            }
            // ---------------------------------

            // --- SEND EMAIL ---
            try {
                const user = await User.findByPk(req.user.id);
                if (user) {
                    sendPredictionEmail(user.email, result, req.file.path);
                }
            } catch (emailError) {
                console.error("Failed to find user or send email:", emailError);
            }
            // ------------------

            return res.json(result);

        } catch (e) {
            console.error(`Python script warnings/errors (stderr): ${errorData}`);
            return res.status(500).json({
                error: 'Failed to process image.',
                details: errorData || 'Python script did not return valid JSON.'
            });
        }
    }); // This is the correct closing for pythonProcess.on('close', ...)
}); // This is the correct closing for router.post(...)

module.exports = router;
