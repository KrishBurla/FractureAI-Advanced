const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const sendPredictionEmail = require('../utils/sendEmail');
const Prediction = require('../models/Prediction');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', [authMiddleware, upload.single('image')], (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { patientName, patientAge, patientSex } = req.body;
    if (!patientName || !patientAge || !patientSex) {
        return res.status(400).json({ message: 'Patient name, age, and sex are required.' });
    }

    const imagePath = req.file.path;
    const pythonScript = path.join(__dirname, '..', 'predict.py');
    const pythonProcess = spawn('python', [pythonScript, imagePath]);

    let predictionData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => { predictionData += data.toString(); });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Script Error: ${data}`);
        errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to process image.', details: errorData });
        }

        try {
            const result = JSON.parse(predictionData);
            const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, "/")}`;

            // --- SAVE TO DATABASE (ONCE) ---
            await Prediction.create({
                imagePath: imageUrl,
                result: result.prediction,
                confidence: result.confidence,
                UserId: req.user.id,
                patientName: patientName,
                patientAge: parseInt(patientAge, 10),
                patientSex: patientSex,
            });

            // --- SEND EMAIL ---
            const user = await User.findByPk(req.user.id);
            if (user) {
                sendPredictionEmail(user.email, result, imagePath);
            }

            return res.json(result);

        } catch (e) {
            console.error(`Error after python script execution: ${e}`);
            return res.status(500).json({
                error: 'Failed to process or save data.',
                details: errorData || 'Could not parse python script output.'
            });
        }
    });
});

module.exports = router;