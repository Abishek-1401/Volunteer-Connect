import React from 'react';
import './ChatInfoPanel.css';
import { FaUsers, FaUserCircle } from 'react-icons/fa';

const ChatInfoPanel = ({ info }) => {
  // If no conversation is selected, render an empty panel
  if (!info) {
    return <aside className="chat-info-panel"></aside>;
  }

  return (
    <aside className="chat-info-panel">
      <div className="info-header">
        {info.type === 'dm' ? (
          <img src={info.avatar} alt={info.name} className="info-avatar-img" />
        ) : (
          <div className="info-group-icon"><FaUsers /></div>
        )}
        <h3>{info.name}</h3>
        <p>{info.description}</p>
      </div>

      {info.type === 'group' && (
        <>
          <div className="info-members-section">
            <h4>Members ({info.members.length})</h4>
            <ul className="info-member-list">
              {info.members.map((member, index) => (
                <li key={index}><FaUserCircle /> {member.name}</li>
              ))}
            </ul>
          </div>
          <div className="info-actions">
            <button className="leave-group-btn">Leave Group</button>
          </div>
        </>
      )}
    </aside>
  );
};

export default ChatInfoPanel;