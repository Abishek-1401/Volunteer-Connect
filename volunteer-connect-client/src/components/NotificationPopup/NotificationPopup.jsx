import React from 'react';
import './NotificationPopup.css';

// Mock data for notifications
const mockNotifications = [
  { id: 1, user: { name: 'Cody Fisher', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, action: 'commented on your post:', content: 'Great work on the garden!', time: '5m ago' },
  { id: 2, user: { name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }, action: 'joined your project:', content: 'Beach Cleanup Drive', time: '1h ago' },
  { id: 3, user: { name: 'Eleanor Pena', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }, action: 'replied to your comment:', content: 'See you there!', time: '3h ago' },
];

const NotificationPopup = () => {
  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h3>Notifications</h3>
      </div>
      <div className="notification-list">
        {mockNotifications.map(notif => (
          <div key={notif.id} className="notification-item">
            <img src={notif.user.avatar} alt={notif.user.name} className="notification-avatar" />
            <div className="notification-text">
              <p>
                <strong>{notif.user.name}</strong> {notif.action} <em>"{notif.content}"</em>
              </p>
              <span className="notification-time">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPopup;