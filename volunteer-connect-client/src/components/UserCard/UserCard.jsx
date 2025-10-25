import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import './UserCard.css';

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.following) {
      setIsFollowing(currentUser.following.includes(user._id));
    }
  }, [currentUser, user._id]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const endpoint = isFollowing ? `/api/users/${user._id}/unfollow` : `/api/users/${user._id}/follow`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error('Failed to toggle follow status');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-card">
      <FaUserCircle className="user-card-avatar" />
      <div className="user-card-info">
        <span className="user-card-name">{user.name}</span>
        <span className="user-card-title">{user.username}</span>
      </div>
      {currentUser && currentUser._id !== user._id && (
        <button
          className={`user-card-button ${isFollowing ? 'following' : ''}`}
          onClick={handleFollowToggle}
          disabled={loading}
        >
          {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
