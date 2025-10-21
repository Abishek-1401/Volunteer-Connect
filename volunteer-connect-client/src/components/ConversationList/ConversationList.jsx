import React from 'react';
import './ConversationList.css';
import { FaUsers, FaSearch } from 'react-icons/fa';

const ConversationList = ({ conversations, selectedConvoId, onConvoClick }) => {
  return (
    <aside className="conversation-list-panel">
      <div className="convo-list-header">
        <h2>Messages</h2>
        <div className="convo-search-bar">
          <FaSearch />
          <input type="text" placeholder="Search messages" />
        </div>
      </div>
      <div className="convo-items-container">
        {conversations.map(convo => (
          <div
            key={convo.id}
            className={`convo-item ${convo.id === selectedConvoId ? 'active' : ''}`}
            onClick={() => onConvoClick(convo.id)}
          >
            <div className="convo-avatar-wrapper">
              {convo.type === 'dm' ? (
                <img src={convo.avatar} alt={convo.name} className="convo-avatar-img" />
              ) : (
                <div className="convo-group-icon"><FaUsers /></div>
              )}
              {convo.online && <div className="online-indicator"></div>}
            </div>
            <div className="convo-details">
              <span className="convo-name">{convo.name}</span>
              <p className="convo-last-message">{convo.lastMessage}</p>
            </div>
            <span className="convo-time">{convo.time}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
