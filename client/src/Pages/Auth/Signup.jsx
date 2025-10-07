import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Your asset imports
import logoImage from '../assets/logo.png';
import sliderImg1 from '../assets/slider1.jpg';
import sliderImg2 from '../assets/slider2.jpg';
import EyeOpenIcon from '../assets/eye.svg';
import EyeClosedIcon from '../assets/hidden_eye.svg';

import './Auth.css';

const sliderImages = [sliderImg1, sliderImg2];

// --- SVG for Checkmark ---
const CheckIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// --- Password Strength Component ---
const PasswordStrength = ({ password }) => {
  const rules = [
    { text: 'At least 8 characters', regex: /.{8,}/ },
    { text: 'An uppercase letter', regex: /(?=.*[A-Z])/ },
    { text: 'A lowercase letter', regex: /(?=.*[a-z])/ },
    { text: 'A number', regex: /(?=.*\d)/ },
    { text: 'A special character', regex: /(?=.*[\W_])/ },
  ];

  return (
    <ul className="password-checklist">
      {rules.map((rule, index) => (
        <li
          key={index}
          className={`checklist-item ${rule.regex.test(password) ? 'satisfied' : ''}`}
        >
          <CheckIcon />
          <span>{rule.text}</span>
        </li>
      ))}
    </ul>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your final validation and API call would go here
    console.log('Submitting form...', formData);
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
          <h2>Create an Account</h2>
          <form className="form" onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                list="email-suggestions"
                required
              />
              <datalist id="email-suggestions">
                <option value="@gmail.com" />
                <option value="@yahoo.com" />
                <option value="@outlook.com" />
              </datalist>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? EyeClosedIcon : EyeOpenIcon} alt="Toggle password visibility" />
                </button>
              </div>
              <PasswordStrength password={formData.password} />
            </div>
            <button type="submit" className="button">Sign Up</button>
            <Link to="/login" className="signin-link">
              Already a member? <span>Sign In</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;  