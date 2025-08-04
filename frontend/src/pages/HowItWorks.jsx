import React from 'react';
import './StaticPages.css';

const HowItWorks = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-card">
        <h1>How It Works</h1>
        <p>Using FractureAI is a simple, three-step process designed for efficiency and ease of use.</p>
        
        <div className="step">
          <h3>1. Upload Your Image</h3>
          <p>Navigate to your dashboard and use the secure drag-and-drop interface to upload a patient's X-ray image. You can also click to browse and select a file from your computer. The system accepts common image formats like JPG and PNG.</p>
        </div>

        <div className="step">
          <h3>2. AI-Powered Analysis</h3>
          <p>Once you submit the image, our backend server preprocesses it and feeds it into our trained Convolutional Neural Network (CNN). The model analyzes the image for fracture patterns in a matter of seconds.</p>
        </div>

        <div className="step">
          <h3>3. Receive Instant Results</h3>
          <p>The system will display the diagnosis directly on your dashboard, classifying the result as No Fracture, Simple Fracture, or Comminuted Fracture. You will also see a confidence score, indicating the model's certainty. A detailed report is simultaneously sent to your registered email address for your records.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;