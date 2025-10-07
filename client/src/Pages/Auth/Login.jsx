import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Your asset imports
import logoImage from '../../assets/logo.png';
import sliderImg1 from '../../assets/slider1.jpg';
import sliderImg2 from '../../assets/slider2.jpg';
import EyeOpenIcon from '../../assets/eye.svg';
import EyeClosedIcon from '../../assets/hidden_eye.svg';

import './Auth.css';

const sliderImages = [sliderImg1, sliderImg2];


const Login = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="image-slider-panel">
          {sliderImages.map((image, index) => (
            <img
              key={index}
              src={image}
              className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
              alt={`Slider promotion ${index + 1}`}
            />
          ))}
        </div>

        <div className="form-panel">
          <Link to="/" className="logo">
            <img src={logoImage} alt="Company Logo" />
          </Link>
          <h2>Log In</h2>
          <form className="form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? EyeClosedIcon : EyeOpenIcon} alt="Toggle password visibility" />
                </button>
              </div>
            </div>
            <button type="submit" className="button">Log In</button>
            <Link to="/signup" className="signin-link">
              Don't have an account? <span>Sign Up</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;