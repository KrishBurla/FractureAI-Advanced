import React from 'react';
import { motion } from 'framer-motion';
import { recommendations } from '../../utils/recommendations';
import './ResultCard.css';

// The component now accepts the 'user' prop
const ResultCard = ({ user, result, onReset }) => {
  const { prediction, confidence } = result;
  const confidencePercent = (confidence * 100).toFixed(2);
  
  const specificRecommendations = recommendations[prediction];

  const formatPrediction = (text) => {
    return text.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="result-card">
      <h3>Analysis Result</h3>
      {/* ... (prediction and confidence sections are unchanged) ... */}
      <div className="result-item">
        <span className="result-label">Prediction:</span>
        <span className="result-value prediction">{formatPrediction(prediction)}</span>
      </div>
      <div className="result-item">
        <span className="result-label">Confidence:</span>
        <div className="confidence-bar-container">
          <motion.div
            className="confidence-bar"
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <span className="result-value confidence">{confidencePercent}%</span>
      </div>

      {specificRecommendations && (
        <div className="recommendations-section">
          <h4>{specificRecommendations.title}</h4>
          <ul>
            {specificRecommendations.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- ADD THIS NEW NOTIFICATION SECTION --- */}
      <div className="email-notification">
        <span className="email-icon">📧</span>
        A detailed report has been sent to your registered email: <strong>{user?.email}</strong>
      </div>
      {/* ----------------------------------------- */}

      <p className="disclaimer">
        Disclaimer: This is an AI-generated analysis and not a substitute for professional medical advice.
      </p>
      <button onClick={onReset} className="reset-button">Analyze Another Image</button>
    </div>
  );
};

export default ResultCard;