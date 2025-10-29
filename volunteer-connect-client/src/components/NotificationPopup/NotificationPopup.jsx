import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationPopup.css';

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="notification-popup">
        <div className="notification-header">
          <h3>Notifications</h3>
        </div>
        <div className="notification-list">
          <div className="notification-item">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h3>Notifications</h3>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="notification-item">No notifications</div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif._id}
              className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
            >
              <img
                src={notif.fromUser.profileImage || '/default-avatar.png'}
                alt={notif.fromUser.name}
                className="notification-avatar"
              />
              <div className="notification-text">
                <p>{notif.message}</p>
                <span className="notification-time">{formatTime(notif.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
