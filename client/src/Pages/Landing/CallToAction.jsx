// src/components/CallToAction.jsx
// No changes from previous version, just for context

import React from 'react';
import useInView from '../../hooks/useInView';
import './CallToAction.css';
import './SharedLanding.css';

const CallToAction = () => {
  const [sectionRef, inView] = useInView({ threshold: 0.5 });

  return (
    <section 
      className={`cta-final-section ${inView ? 'in-view' : ''}`} 
      id="contact" 
      ref={sectionRef} 
    >
      <h2 className="cta-final-title">Ready to Make Your Impact?</h2>
      <p className="cta-final-subtitle">
        Join ImpactConnect today and become part of a growing community dedicated to social good.
      </p>
      <a href="./Signup"><button className="cta-button">Get Started Now</button></a>
    </section>
  );
};

export default CallToAction;