// src/components/Landing.jsx

import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Hero from './Hero';
import Problem from './Problem';
import HowItWorks from './HowItWorks';
import Vision from './Vision';
import CallToAction from './CallToAction';
import Preloader from './Preloader';

import './Landing.css';

const Landing = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only when the Landing component mounts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2-second delay

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <div>
      {loading ? (
        <Preloader />
      ) : (
        <div className="main-content">
          <NavBar />
          <Hero />
          <Problem />
          <HowItWorks />
          <Vision />
          <CallToAction />
        </div>
      )}
    </div>
  );
};

export default Landing;