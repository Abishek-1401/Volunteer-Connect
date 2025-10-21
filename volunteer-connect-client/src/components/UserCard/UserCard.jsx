import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './UserCard.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <FaUserCircle className="user-card-avatar" />
      <div className="user-card-info">
        <span className="user-card-name">{user.name}</span>
        <span className="user-card-title">{user.title}</span>
      </div>
      <button className="user-card-button">Follow</button>
    </div>
  );
};

export default UserCard;