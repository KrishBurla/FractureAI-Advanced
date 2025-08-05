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
    // --- DEBUG STEP 1: Log that the request was received ---
    console.log('\n--- NEW PREDICTION REQUEST ---');
    
    if (!req.file) {
        console.log('[ERROR] Request failed: No file was uploaded.');
        return res.status(400).send('No file uploaded.');
    }
    
    // --- DEBUG STEP 2: Log all received body data ---
    const { patientName, patientAge, patientSex } = req.body;
    console.log('Received Patient Details:', { patientName, patientAge, patientSex });

    if (!patientName || !patientAge || !patientSex) {
        console.log('[ERROR] Request failed: Missing patient details.');
        return res.status(400).send('Patient name, age, and sex are required.');
    }

    const imagePath = req.file.path;
    const pythonScriptPath = path.resolve(__dirname, '..', 'predict.py'); // Use absolute path
    
    // --- DEBUG STEP 3: Log paths before executing ---
    console.log(`Attempting to execute Python script: "${pythonScriptPath}"`);
    console.log(`With image argument: "${imagePath}"`);

    const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);

    let predictionData = '';
    let errorData = ''; // <-- This will store any error messages

    // Listen to the normal output of the script
    pythonProcess.stdout.on('data', (data) => {
        console.log(`[PYTHON STDOUT]: ${data.toString()}`);
        predictionData += data.toString();
    });

    // --- CRITICAL DEBUG STEP: Listen to the error output of the script ---
    // Any error inside predict.py (like a missing library or file) will be caught here.
    pythonProcess.stderr.on('data', (data) => {
        console.error(`[!!! PYTHON STDERR !!!]: ${data.toString()}`);
        errorData += data.toString();
    });

    // --- DEBUG STEP 4: Log when the script finishes and what its exit code is ---
    pythonProcess.on('close', async (code) => {
        console.log(`Python script finished with exit code: ${code}`);

        // If the exit code is anything other than 0, it means an error occurred.
        if (code !== 0) {
            console.log('[ERROR] Python script failed. Sending error response.');
            return res.status(500).json({
                error: 'Failed to process image due to a script error.',
                details: errorData // Send the captured error to the frontend
            });
        }

        try {
            console.log('Parsing JSON and saving to database...');
            const result = JSON.parse(predictionData);

            const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;

            await Prediction.create({
                imagePath: imageUrl,
                result: result.prediction,
                confidence: result.confidence,
                UserId: req.user.id,
                patientName,
                patientAge: parseInt(patientAge, 10),
                patientSex,
            });
            console.log('Prediction saved successfully.');

            const user = await User.findByPk(req.user.id);
            if (user) {
                sendPredictionEmail(user.email, result, imageUrl);
                console.log('Email sent.');
            }

            console.log('--- REQUEST SUCCEEDED ---');
            return res.json(result);

        } catch (e) {
            console.error('[ERROR] Failed after script execution (JSON parsing or DB save):', e);
            return res.status(500).json({
                error: 'Failed to save data or parse the result from the script.',
                details: e.message
            });
        }
    });
});

module.exports = router;