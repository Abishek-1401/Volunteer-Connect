// src/components/Preloader.jsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap'; // Assuming you have GSAP installed
import fullLogo from '../assets/logo.png';
import './Preloader.css';

const Preloader = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    // GSAP animation for the logo
    gsap.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out'
    });
  }, []);

  return (
    <div className="preloader-container">
      <img 
        src={fullLogo} 
        alt="Loading..." 
        className="preloader-logo" 
        ref={logoRef}
      />
    </div>
  );
};

export default Preloader;