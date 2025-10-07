import React from 'react';
import authorPic from '../../assets/slider1.jpg';

const ActivityFeed = () => (
  <div className="card">
    <h4>Activity</h4>
    <div className="activity-list">
      <div className="activity-item">
        <img src={authorPic} alt="User" />
        <p><strong>Deraa</strong> started following you. 5m</p>
      </div>
      <div className="activity-item">
        <img src={authorPic} alt="User" />
        <p><strong>Ediwp</strong> liked your photo. 30m</p>
      </div>
    </div>
  </div>
);

export default ActivityFeed;