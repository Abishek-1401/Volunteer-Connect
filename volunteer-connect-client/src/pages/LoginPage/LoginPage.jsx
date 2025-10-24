// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import '../AuthStyles.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email.trim() === '' || formData.password.trim() === '') {
        alert('Please enter both email and password.');
        return;
    }
    try {
      await login(formData);
      alert('Login successful!');
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.msg || 'An error occurred during login.');
    }
  };

  return (
    <div className="auth-page">
      <img src="/logo.png" alt="VolunteerConnect Logo" className="auth-logo" />
      <div className="auth-container">
        <h1 className="auth-title">Welcome Back</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="auth-button">Log In</button>
        </form>
        <p className="auth-switch-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;