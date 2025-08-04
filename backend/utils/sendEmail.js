const nodemailer = require('nodemailer');
require('dotenv').config();

// The function now accepts an imagePath
const sendPredictionEmail = async (userEmail, predictionResult, imagePath) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Fracture Detection AI" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Your X-Ray Analysis Result',
            // --- New professional HTML body ---
            html: `
              <div style="background-color: #f7f5f2; margin: 0; padding: 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                  <div style="background-color: #333; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px;">Fracture Detection Report</h1>
                  </div>
                  <div style="padding: 30px;">
                    <h2 style="font-size: 20px; color: #333;">Analysis Complete</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Thank you for using our service. Here is the AI-generated report for your submitted X-ray.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                      <img src="cid:xrayimage" alt="Submitted X-Ray" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;"/>
                    </div>

                    <div style="background-color: #f7f5f2; padding: 20px; border-radius: 4px;">
                      <h3 style="margin-top: 0; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Results</h3>
                      <p style="font-size: 18px; margin: 10px 0;"><strong>Prediction:</strong> <span style="font-weight: bold; color: #d9534f;">${predictionResult.prediction.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span></p>
                      <p style="font-size: 18px; margin: 10px 0;"><strong>Confidence:</strong> <span style="font-weight: bold; color: #333;">${(predictionResult.confidence * 100).toFixed(2)}%</span></p>
                    </div>

                    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
                      <p><strong>Disclaimer:</strong> This is an AI-generated analysis and is not a substitute for a professional medical diagnosis. Please consult a qualified doctor for any medical concerns.</p>
                      <p>&copy; ${new Date().getFullYear()} Fracture Detection App. All Rights Reserved.</p>
                    </div>
                  </div>
                </div>
              </div>
            `,
            // --- This section attaches the image ---
            attachments: [{
                filename: 'xray-result.jpg',
                path: imagePath,
                cid: 'xrayimage' // a unique ID for the image
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Professional email sent successfully.');

    } catch (error) {
        console.error('❌ Error sending professional email:', error);
    }
};

module.exports = sendPredictionEmail;