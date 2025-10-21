import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileHeader.css';
import coverPhoto from '../../assets/cover-placeholder.svg';
import { FaUserCircle } from 'react-icons/fa';

// The component now accepts a 'user' prop
const ProfileHeader = ({ user }) => {
  // If there's no user, don't render anything
  if (!user) return null;

  return (
    <div className="profile-header-card">
      <div className="cover-photo-container">
        <img src={coverPhoto} alt="Cover" className="cover-photo" />
      </div>
      <div className="profile-details">
        {/* We can use user.profileImageUrl here if it exists */}
        <FaUserCircle className="profile-picture-page" />

        <div className="profile-text-info">
            <h1 className="profile-name-page">{user.name}</h1>
            <p className="profile-title-page">MERN Stack Developer | Community Volunteer</p>
        </div>
        
        <Link to="/profile/edit" className="edit-profile-btn">Edit Profile</Link>
      </div>
    </div>
  );
};

export default ProfileHeader;