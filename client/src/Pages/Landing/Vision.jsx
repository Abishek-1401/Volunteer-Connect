// src/components/Vision.jsx

import React from 'react';
import useInView from '../../hooks/useInView';
import './SharedLanding.css';
import './Vision.css';

const Vision = () => {
  const [sectionRef, inView] = useInView({ threshold: 0.5 });

  return (
    <section 
      className={`vision-section ${inView ? 'in-view' : ''}`} 
      id="vision" 
      ref={sectionRef}
    >
      <div className="vision-content">
        <h2 className="section-title">Our Vision: A World Connected by Purpose.</h2>
        <p className="vision-description">
          We believe that a more connected volunteering community is a more impactful one. <strong>ImpactConnect</strong> is designed to be the digital engine for social change, empowering every individual to find their cause and every organization to find the people they need to succeed.
        </p>
      </div>
    </section>
  );
};

export default Vision;