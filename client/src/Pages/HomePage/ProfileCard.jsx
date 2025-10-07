import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card-container">
      <div className="profile-avatar-wrapper">
        <img src={user.profileImage} alt={user.name} className="profile-avatar" />
      </div>
      
      <h3 className="profile-name">{user.name}</h3>
      <p>@{user.handle}</p>
      
      <div className="profile-stats">
        <div>
          <strong>{user.stats.followers}</strong>
          <span>Followers</span>
        </div>
        |
        <div>
          <strong>{user.stats.following}</strong>
          <span>Following</span>
        </div>
      </div>

      <div className="profile-skills">
        {user.skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
      
      <p className="profile-bio">{user.bio}</p>
    </div>
  );
};

export default ProfileCard;