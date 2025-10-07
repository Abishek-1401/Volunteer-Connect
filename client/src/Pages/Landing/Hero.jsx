// src/components/Hero.jsx

import React from 'react';
import './Hero.css';
import './SharedLanding.css';

const Hero = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <div className="logo-placeholder">
          <span className="logo-icon">💜</span>
          <span className="logo-text">ImpactConnect</span>
        </div>
        <h1 className="hero-title">
          Built for a <span className="highlight-text">Future Where Social Service</span> Lasts for Lifetimes.
        </h1>
        <p className="hero-subtitle">
          Bring purpose-driven action full circle, with just one click.
        </p>
        <a href="./Signup"><button className="cta-button">Join the Movement</button></a>
      </div>
      <div className="hero-shape-accent"></div>
    </section>
  );
};

export default Hero; 