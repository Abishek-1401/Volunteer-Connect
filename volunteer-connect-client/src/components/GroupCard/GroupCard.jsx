import React from 'react';
import { FaUsers } from 'react-icons/fa';
import './GroupCard.css';

const GroupCard = ({ group }) => {
  return (
    <div className="group-card">
      <FaUsers className="group-card-avatar" />
      <div className="group-card-info">
        <span className="group-card-name">{group.name}</span>
        <span className="group-card-desc">{group.description}</span>
      </div>
      <button className="group-card-button">Join</button>
    </div>
  );
};

export default GroupCard;