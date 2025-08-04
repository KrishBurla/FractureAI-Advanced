import React from 'react';
import './StaticPages.css';

const About = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-card">
        <h1>About FractureAI</h1>
        <p>
          FractureAI is a powerful, AI-driven tool designed to assist medical professionals in the rapid detection and classification of bone fractures from X-ray images. Our mission is to leverage cutting-edge machine learning to provide a reliable, efficient, and user-friendly diagnostic aid.
        </p>
        
        <h2>Our Team</h2>
        <p>This project was brought to life by a dedicated team of developers passionate about the intersection of technology and healthcare.</p>
        <div className="team-container">
          <div className="team-member-card">
            <div className="team-member-img-placeholder"></div>
            <h3>Krish Burla</h3>
            <p>Lead Developer - Focused on backend architecture and ML model integration.</p>
          </div>
          <div className="team-member-card">
            <div className="team-member-img-placeholder"></div>
            <h3>Shree Bhende</h3>
            <p>Frontend Specialist - Designed and implemented the user interface and experience.</p>
          </div>
          <div className="team-member-card">
            <div className="team-member-img-placeholder"></div>
            <h3>Naman Bhatia</h3>
            <p>Data & ML Engineer - Responsible for dataset preparation and model training.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;