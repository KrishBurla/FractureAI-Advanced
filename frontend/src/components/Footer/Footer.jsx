import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>FractureAI</h4>
          <p>AI-powered bone fracture detection to assist medical professionals.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FractureAI. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;