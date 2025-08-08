import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import './HowItWorks.css';

// A simple helper component for each step
const InfoSection = ({ title, children }) => (
  <div className="info-section">
    <h2>{title}</h2>
    <p>{children}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <AnimatedPage>
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h1>How FractureAI Works</h1>
          <p>From a simple image to an intelligent analysis in seconds.</p>
          <p>Here's a look under the hood.</p>
        </div>

        <div className="info-content">
          <InfoSection title="1. Secure Upload">
            You start by securely uploading an X-ray image. The system accepts common formats like JPG and PNG for your convenience. Your data is encrypted and handled with care.
          </InfoSection>

          <InfoSection title="2. Image Pre-Processing">
            Our system automatically prepares your image for the AI. This involves resizing the image to a standard format, normalizing pixel values, and converting it into a tensor that our neural network can understand.
          </InfoSection>

          <InfoSection title="3. AI Analysis with a CNN">
            The prepared image is passed through our custom-trained Convolutional Neural Network (CNN). A CNN is a specialized type of AI designed to recognize patterns in images. It scans for key features, textures, and anomalies that are indicative of different types of fractures.
          </InfoSection>

          <InfoSection title="4. Instant & Clear Results">
            Within seconds, the model classifies the X-ray and returns a prediction with a confidence score. This result is then displayed to you in a clear, easy-to-read format, and a confirmation is sent to your registered email address.
          </InfoSection>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default HowItWorks;