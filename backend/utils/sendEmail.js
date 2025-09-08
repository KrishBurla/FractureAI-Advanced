const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendPredictionEmail = async (user, predictionDetails) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const localImagePath = path.join(__dirname, '..', predictionDetails.imagePath.substring(predictionDetails.imagePath.indexOf('uploads')));

        const mailOptions = {
            from: `"FractureAI" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Your FractureAI Analysis Report',
            // --- NEW & IMPROVED HTML ---
  html: `
              <body style="background-color: #f3f4f6; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                  
                  <div style="background-color: #111827; color: #ffffff; padding: 24px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600;">FractureAI Report</h1>
                  </div>
                  
                  <div style="padding: 32px;">
                    <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hello ${user.fullName},</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #374151;">Here is the AI-generated report for the submitted X-ray image.</p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                      <img src="cid:xrayimage" alt="Submitted X-Ray" style="max-width: 100%; border: 1px solid #d1d5db; border-radius: 8px;"/>
                    </div>

                    <div style="border: 1px solid #e5e7eb; border-radius: 8px;">
                      <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
                        <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 18px; font-weight: 600; color: #111827;">Patient Details</h3>
                        <p style="font-size: 16px; margin: 8px 0; color: #4b5563;"><strong>Patient ID:</strong> ${predictionDetails.patientId || 'N/A'}</p>
                        <p style="font-size: 16px; margin: 8px 0; color: #4b5563;"><strong>Name:</strong> ${predictionDetails.patientName}</p>
                        <p style="font-size: 16px; margin: 8px 0; color: #4b5563;"><strong>Age:</strong> ${predictionDetails.patientAge}</p>
                        <p style="font-size: 16px; margin: 8px 0; color: #4b5563;"><strong>Sex:</strong> ${predictionDetails.patientSex}</p>
                      </div>

                      <div style="padding: 20px; background-color: #f9fafb; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                        <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 18px; font-weight: 600; color: #111827;">Analysis Results</h3>
                        <p style="font-size: 18px; margin: 10px 0; color: #4b5563;"><strong>Prediction:</strong> <span style="font-weight: bold; color: #b91c1c;">${(predictionDetails.result || '').replace(/_/g, ' ')}</span></p>
                        <p style="font-size: 18px; margin: 10px 0; color: #4b5563;"><strong>Confidence:</strong> <span style="font-weight: bold; color: #111827;">${(predictionDetails.confidence * 100).toFixed(2)}%</span></p>
                      </div>
                    </div>

                    <div style="margin-top: 32px; text-align: center; font-size: 12px; color: #6b7280;">
                      <p style="margin: 0;"><strong>Disclaimer:</strong> This is an AI-generated analysis and is not a substitute for a professional medical diagnosis. Please consult a qualified doctor for any medical concerns.</p>
                      <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} FractureAI. All Rights Reserved.</p>
                    </div>
                  </div>
                </div>
              </body>
            `,
            attachments: [{
                filename: 'xray-result.jpg',
                path: localImagePath,
                cid: 'xrayimage' 
            }]
        };
        
        // Only try to send the email if the image file actually exists
        if (fs.existsSync(localImagePath)) {
            await transporter.sendMail(mailOptions);
            console.log('✅ Professional email sent successfully.');
        } else {
            console.error(`❌ Error: Could not find image to attach at ${localImagePath}`);
        }

    } catch (error) {
        console.error('❌ Error sending professional email:', error);
    }
};

module.exports = sendPredictionEmail;