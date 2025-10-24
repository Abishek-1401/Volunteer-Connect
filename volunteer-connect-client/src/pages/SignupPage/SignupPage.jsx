import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

import '../AuthStyles.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    username: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { password } = formData;
    setPasswordValidity({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9\s]/.test(password),
    });
  }, [formData, formData.password]);

  useEffect(() => {
    if (formData.confirmPassword.length > 0) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // This is a simplified client-side check. The backend does the ultimate validation.
    if (!passwordsMatch) {
      showToast('Passwords do not match.', 'error');
      return false;
    }
    const allPasswordValid = Object.values(passwordValidity).every(Boolean);
    if (!allPasswordValid) {
      showToast('Password does not meet all requirements.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userData = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
        
        // Direct API call
        const res = await axios.post('/api/users/register', userData); 

        // Direct token handling
        localStorage.setItem('token', res.data.token);

        showToast('Account created successfully!', 'success');
        navigate('/home');
      } catch (err) {
        showToast(err.response?.data?.msg || 'An error occurred during registration.', 'error');
      }
    }
  };

  return (
    <div className="auth-page">
      <img src="/logo.png" alt="VolunteerConnect Logo" className="auth-logo" />
      <div className="auth-container">
        <h1 className="auth-title">Create an Account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" className="auth-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" className="auth-input" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className="auth-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" className="auth-input" value={formData.password} onChange={handleChange} required />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" className="auth-input" value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <ul className="password-criteria">
            <li className={passwordValidity.length ? 'valid' : ''}>At least 8 characters</li>
            <li className={passwordValidity.uppercase ? 'valid' : ''}>An uppercase letter</li>
            <li className={passwordValidity.lowercase ? 'valid' : ''}>A lowercase letter</li>
            <li className={passwordValidity.number ? 'valid' : ''}>A number</li>
            <li className={passwordValidity.special ? 'valid' : ''}>A special character</li>
            <li className={passwordsMatch ? 'valid' : 'invalid'}>Passwords match</li>
          </ul>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;