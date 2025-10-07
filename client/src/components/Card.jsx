import React from 'react';
import './Card.css'; // We'll create this CSS file next

const Card = ({ title, children }) => {
  return (
    <div className="reusable-card">
      {title && <h4>{title}</h4>}
      <div className="reusable-card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;