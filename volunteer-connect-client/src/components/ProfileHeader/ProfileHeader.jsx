import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProfileHeader.css';
import coverPhoto from '../../assets/cover-placeholder.svg';
import { FaUserCircle } from 'react-icons/fa';
import FollowersModal from '../FollowersModal/FollowersModal';

// The component now accepts a 'user' prop
const ProfileHeader = ({ user }) => {
  const [followerCount, setFollowerCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFollowerCount();
    }
  }, [user]);

  // If there's no user, don't render anything
  if (!user) return null;

  const fetchFollowerCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`/api/users/${user._id}/followers`, config);
      setFollowerCount(data.length);
      setFollowers(data);
    } catch (err) {
      console.error("Error fetching follower count:", err);
    }
  };

  const handleFollowerClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUnfollow = async (followerId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/users/unfollow/${followerId}`, config);
      // Refresh follower count and list
      fetchFollowerCount();
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  return (
    <>
      <div className="profile-header-card">
        <div className="cover-photo-container">
          <img
            src={user.coverImage ? `http://localhost:5000/${user.coverImage}` : coverPhoto}
            alt="Cover"
            className="cover-photo"
          />
        </div>
        <div className="profile-details">
          {user.profileImage ? (
            <img
              src={`http://localhost:5000/${user.profileImage}`}
              alt="Profile"
              className="profile-picture-page"
            />
          ) : (
            <FaUserCircle className="profile-picture-page" />
          )}

          <div className="profile-text-info">
            <h1 className="profile-name-page">{user.name}</h1>
            <p className="profile-title-page">MERN Stack Developer | Community Volunteer</p>
            <div className="follower-info">
              <span
                className="follower-count clickable"
                onClick={handleFollowerClick}
              >
                {followerCount} {followerCount === 1 ? 'Follower' : 'Followers'}
              </span>
            </div>
          </div>

          <Link to="/profile/edit" className="edit-profile-btn">Edit Profile</Link>
        </div>
      </div>

      <FollowersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        followers={followers}
        onUnfollow={handleUnfollow}
      />
    </>
  );
};

export default ProfileHeader;
