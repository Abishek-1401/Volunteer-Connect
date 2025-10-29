import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './FollowersModal.css';

const FollowersModal = ({ isOpen, onClose, userId }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowers();
    }
  }, [isOpen, userId]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`/api/users/${userId}/followers`, config);
      setFollowers(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
      showToast('Failed to load followers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followerId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/users/${followerId}/unfollow`, {}, config);
      setFollowers(followers.filter(f => f._id !== followerId));
      showToast('Unfollowed successfully', 'success');
    } catch (error) {
      console.error('Error unfollowing:', error);
      showToast('Failed to unfollow', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content followers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Followers</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p>Loading followers...</p>
          ) : followers.length === 0 ? (
            <p>No followers yet.</p>
          ) : (
            <div className="followers-list">
              {followers.map((follower) => (
                <div key={follower._id} className="follower-item">
                  <div className="follower-info">
                    <img
                      src={follower.profileImage || '/assets/default-avatar.png'}
                      alt={follower.name}
                      className="follower-avatar"
                    />
                    <div className="follower-details">
                      <h4>{follower.name}</h4>
                      <p>@{follower.username}</p>
                    </div>
                  </div>
                  {user && user._id !== follower._id && (
                    <button
                      className="unfollow-btn"
                      onClick={() => handleUnfollow(follower._id)}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
