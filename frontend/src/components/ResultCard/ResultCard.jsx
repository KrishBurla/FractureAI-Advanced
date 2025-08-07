import React from 'react';
import { motion } from 'framer-motion';
import { recommendations } from '../../utils/recommendations';
import './ResultCard.css';

const ResultCard = ({ user, result, onReset }) => {
  // Use 'prediction' if it exists, otherwise fall back to 'result' for consistency
  const prediction = result.prediction || result.result;
  const confidencePercent = (result.confidence * 100).toFixed(2);
  
  const specificRecommendations = recommendations[prediction];

  const formatPrediction = (text) => {
    if (!text) return 'N/A';
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="result-card-container">
      <h3>Analysis Result</h3>
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
      
      <div className="email-notification">
        <span role="img" aria-label="email">📧</span>
        A detailed report has been sent to your registered email: <strong>{user?.email}</strong>
      </div>

      <p className="disclaimer">
        Disclaimer: This is an AI-generated analysis and not a substitute for professional medical advice.
      </p>

      <button onClick={onReset} className="reset-button">Analyze Another Image</button>
    </div>
  );
};

export default ResultCard;