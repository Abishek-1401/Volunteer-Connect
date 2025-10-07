import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeNavbar.css';
import logo from '../assets/logo.png';
import profilePic from '../assets/profile.jpg';

const HomeNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="home-navbar">
      <div className="home-navbar-container">
        <Link to="/home">
          <img src={logo} alt="Logo" className="home-navbar-logo" />
        </Link>

        <div className="home-navbar-search">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="home-navbar-menu">
          <div className="home-navbar-icons">
            <span>🔔</span> {/* Notifications */}
            <span>💬</span> {/* Messages */}
          </div>

          <div className="profile-dropdown">
            <button className="profile-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={profilePic} alt="Your Profile" />
              <span>Abishek</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <Link to="/logout">Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;