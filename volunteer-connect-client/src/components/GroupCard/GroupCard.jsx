import React from 'react';
import { Link } from 'react-router-dom';
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
      <Link to={`/groups/${group._id}`} className="group-card-button">View Details</Link>
    </div>
  );
};

export default GroupCard;