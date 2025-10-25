import React from 'react';
import './LeftSidebar.css';
import { useAuth } from '../../hooks/useAuth';
import { FaUserCircle } from 'react-icons/fa';

const LeftSidebar = () => {
  const { user } = useAuth();

  // If there's no user data yet (e.g., while loading), don't render the card
  if (!user) {
    return <aside className="left-sidebar"></aside>;
  }

  return (
    <aside className="left-sidebar">
      <div className="profile-card-new">
        <div className="profile-header-new">
          {/* We could use user.profileImageUrl here if it existed */}
          <FaUserCircle className="profile-picture-new" />
        </div>
        
        <div className="profile-body-new">
          <h3 className="profile-name-new">{user.name}</h3>
          <p className="profile-handle-new">@{user.username}</p>

          <div className="profile-stats-new">
            <div className="stat">
              <span className="stat-number">{user.followers ? user.followers.length : 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <span className="stat-divider">|</span>
            <div className="stat">
              <span className="stat-number">{user.following ? user.following.length : 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          <div className="profile-tags-new">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <span key={index} className="tag">{skill}</span>
              ))
            ) : (
              <>
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Express</span>
              </>
            )}
          </div>

          <div className="profile-bio-new">
            <p>{user.bio || 'Passionate MERN stack developer creating impactful web applications.'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;