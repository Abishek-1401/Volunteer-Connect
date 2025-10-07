// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-scroll"; // Import the Link component
import "./NavBar.css";
import fullLogo from "../../assets/logo.png";
import simpleLogo from "../../assets/logo_mini.png";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo">
          <img
            src={isScrolled ? simpleLogo : fullLogo}
            alt="Volunteer Connect Logo"
            className="logo-img"
          />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="hero" smooth={true} duration={500}>
              Home
            </Link>
          </li>
          <li>
            <Link to="about" smooth={true} duration={500}>
              About
            </Link>
          </li>
          <li>
            <Link to="features" smooth={true} duration={500}>
              Features
            </Link>
          </li>
          <li>
            <Link to="vision" smooth={true} duration={500}>
              Vision
            </Link>
          </li>

          {/* Add a specific class for styling as a button */}
          <li>
            <a href="/signup" className="nav-cta-button">
              Start your Journey
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
