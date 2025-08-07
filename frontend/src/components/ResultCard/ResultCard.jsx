import React from 'react';
import { motion } from 'framer-motion';
import { recommendations } from '../../utils/recommendations';
import './ResultCard.css';

const ResultCard = ({ user, result, onReset }) => {
  const { prediction, confidence, patientName, patientAge, patientSex, imagePath } = result;
  const confidencePercent = (confidence * 100).toFixed(2);
  
  const specificRecommendations = recommendations[prediction];

  const formatPrediction = (text) => {
    if (!text) return 'N/A';
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="result-card-container">
      <h3>Analysis Result</h3>
      
      <div className="result-main-content">
        <div className="result-image-container">
          <img src={imagePath} alt="Analyzed X-Ray" className="result-image" />
        </div>
        
        <div className="result-details-container">
          {patientName && (
            <div className="patient-details-section">
              <h4>Patient Details</h4>
              <p><strong>Name:</strong> {patientName}</p>
              <p><strong>Age:</strong> {patientAge}</p>
              <p><strong>Sex:</strong> {patientSex}</p>
            </div>
          )}

          <div className="analysis-details-section">
            <h4>Analysis</h4>
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
          </div>
        </div>
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