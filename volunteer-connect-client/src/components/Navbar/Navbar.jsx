import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';
import NotificationPopup from '../NotificationPopup/NotificationPopup';
import { 
  FaSearch, 
  FaBell, 
  FaUserCircle, 
  FaSun, 
  FaMoon, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPaperPlane,
  FaUsers,
  FaClipboardList,
  FaCog
} from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  useClickOutside(notificationsRef, () => setIsNotificationsOpen(false));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      } else {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/home" className="logo-link">
            <img src="/logo.png" alt="VolunteerConnect Logo" className="navbar-logo-img" />
          </Link>
        </div>

        <div className="navbar-desktop-items">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
          <div className="navbar-icon-wrapper" ref={notificationsRef}>
            <div className="navbar-icon" onClick={toggleNotifications}>
              <FaBell />
            </div>
            {isNotificationsOpen && <NotificationPopup />}
          </div>

          <Link to="/messenger" className="navbar-icon">
            <FaPaperPlane />
          </Link>
          <Link to="/groups" className="navbar-icon">
            <FaUsers />
          </Link>
          <Link to="/projects" className="navbar-icon">
            <FaClipboardList />
          </Link>

          <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          
          <div className="profile-section" ref={dropdownRef}>
            <FaUserCircle className="profile-icon" onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div className="desktop-dropdown">
                <Link to="/profile" className="desktop-dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  Profile
                </Link>
                <Link to="/settings" className="desktop-dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <FaCog /> Settings
                </Link>
                <button className="desktop-dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hamburger-menu" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <form className="mobile-search-bar" onSubmit={handleSearchSubmit}>
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Link to="/profile" className="mobile-menu-item" onClick={toggleMenu}>
                <FaUserCircle /> Profile
            </Link>
            <Link to="/messenger" className="mobile-menu-item" onClick={toggleMenu}>
                <FaPaperPlane /> Messages
            </Link>
            <Link to="/groups" className="mobile-menu-item" onClick={toggleMenu}>
                <FaUsers /> Groups
            </Link>
            <Link to="/projects" className="mobile-menu-item" onClick={toggleMenu}>
                <FaClipboardList /> Projects
            </Link>
            <div className="mobile-menu-item">
                <FaBell /> Notifications
            </div>
            <Link to="/settings" className="mobile-menu-item" onClick={toggleMenu}>
                <FaCog /> Settings
            </Link>
            <button onClick={() => { toggleTheme(); toggleMenu(); }} className="mobile-menu-item theme-toggle-mobile">
                {theme === 'light' ? <><FaMoon /> Dark Mode</> : <><FaSun /> Light Mode</>}
            </button>
            <div className="mobile-menu-item" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
            </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;