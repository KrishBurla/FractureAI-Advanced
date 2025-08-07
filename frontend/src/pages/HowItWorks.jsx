import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import './HowItWorks.css';

const FlipCard = ({ icon, title, children }) => (
  <div className="flip-card" tabIndex="0">
    <div className="flip-card-inner">
      <div className="flip-card-front">
        <div className="card-icon">{icon}</div>
        <div className="card-title">{title}</div>
      </div>
      <div className="flip-card-back">
        <div className="card-description">{children}</div>
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  return (
    <AnimatedPage>
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h1>How FractureAI Works</h1>
          <p>From a simple image to an intelligent analysis in seconds. Here's a look under the hood.</p>
        </div>

        <div className="flip-card-stack">
          <FlipCard icon="📤" title="1. Secure Upload">
            You start by securely uploading an X-ray image. The system accepts common formats like JPG and PNG for your convenience.
          </FlipCard>
          <FlipCard icon="⚙️" title="2. Image Pre-Processing">
            Our system automatically prepares your image for the AI by resizing, standardizing, and converting it into a format the neural network can understand.
          </FlipCard>
          <FlipCard icon="🧠" title="3. AI Analysis">
            The image is passed through our custom-trained Convolutional Neural Network (CNN) to identify key features and patterns indicative of fractures.
          </FlipCard>
          <FlipCard icon="📊" title="4. Instant Results">
            Within seconds, the model classifies the X-ray and returns a prediction with a confidence score, displayed in a clear, easy-to-read format.
          </FlipCard>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default HowItWorks;