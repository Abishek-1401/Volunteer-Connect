// src/components/HowItWorks.jsx

import React from 'react';
import useInView from '../../hooks/useInView';
import './SharedLanding.css';
import './HowItWorks.css';

const steps = [
  {
    number: "01.",
    title: "Discover Your Cause",
    description: "Browse a personalized feed of volunteer projects from local organizations, filtered by your interests and availability.",
  },
  {
    number: "02.",
    title: "Connect & Collaborate",
    description: "Join teams, chat with fellow volunteers, and share updates on your collective impact directly within the platform.",
  },
  {
    number: "03.",
    title: "Show Your Impact",
    description: "Track your volunteer hours, build a verified social good portfolio, and get recognition for your contributions.",
  }
];

const HowItWorks = () => {
  const [sectionRef, inView] = useInView({ threshold: 0.3 });

  return (
    <section 
      className={`how-it-works-section ${inView ? 'in-view' : ''}`} 
      id="features" 
      ref={sectionRef}
    >
      <h2 className="section-subtitle-small">HOW IT WORKS</h2>
      <h2 className="section-title">Our Cycle of Impact.</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <span className="step-number">{step.number}</span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
       <div className="bottom-accent-shape"></div>
    </section>
  );
};

export default HowItWorks;