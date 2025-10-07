// src/components/Problem.jsx

import React from 'react';
import useInView from '../../hooks/useInView';
import './SharedLanding.css';
import './Problem.css';

const Problem = () => {
  const [sectionRef, inView] = useInView({ threshold: 0.5 });

  return (
    <section 
      className={`problem-section ${inView ? 'in-view' : ''}`}
      id="about" 
      ref={sectionRef} 
    >
      <div className="problem-header">
        <h2 className="section-subtitle-small">WHAT WE DO</h2>
        <h2 className="section-title">Empowering Volunteers Through Connection.</h2>
      </div>
      <div className="problem-content-grid">
        <div className="abstract-circle-left"></div>
        <div className="text-blocks-container">
          <div className="text-block">
            <span className="block-number">01.</span>
            <p>Finding the right volunteer opportunities is scattered and time-consuming, leading to missed chances to make a difference.</p>
          </div>
          <div className="text-block">
            <span className="block-number">02.</span>
            <p>You want to connect with other volunteers, but there's no dedicated space to share your experiences and collaborate.</p>
          </div>
          <div className="text-block">
            <span className="block-number">03.</span>
            <p>There’s no unified way for volunteers to showcase their contributions or for organizations to easily manage their teams.</p>
          </div>
        </div>
      </div>
       <div className="problem-abstract-pattern"></div>
    </section>
  );
};

export default Problem;