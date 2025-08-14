const express = require('express');
const multer = require('multer');
const axios = require('axios'); // We need axios here now
const FormData = require('form-data'); // And form-data
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const sendPredictionEmail = require('../utils/sendEmail');
const Prediction = require('../models/Prediction');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// The URL of our new Python Flask service
const PYTHON_API_URL = 'http://127.0.0.1:5002/predict';

router.post('/', [authMiddleware, upload.single('image')], async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const { patientName, patientAge, patientSex, patientId } = req.body;
        if (!patientName || !patientAge || !patientSex) {
            return res.status(400).json({ message: 'Patient name, age, and sex are required.' });
        }

        // --- NEW: Call the Python API ---
        const form = new FormData();
        form.append('image', fs.createReadStream(req.file.path));

        const pythonResponse = await axios.post(PYTHON_API_URL, form, {
            headers: form.getHeaders(),
        });
        
        const result = pythonResponse.data; // { prediction: '...', confidence: 0.99 }
        const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;

        const newPrediction = await Prediction.create({
            imagePath: imageUrl,
            result: result.prediction,
            confidence: result.confidence,
            UserId: req.user.id,
            patientName,
            patientAge: parseInt(patientAge, 10),
            patientSex,
            patientId,
        });

        const user = await User.findByPk(req.user.id);
        if (user) {
            sendPredictionEmail(user, newPrediction);
        }
        
        // Return the full saved record to the frontend
        return res.json(newPrediction);

    } catch (error) {
        console.error('Error during prediction process:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            error: 'Failed to process image.',
            details: error.response ? error.response.data : 'Could not connect to the prediction service.'
        });
    }
});

module.exports = router;