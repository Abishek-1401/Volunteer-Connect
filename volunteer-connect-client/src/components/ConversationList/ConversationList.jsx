import React from 'react';
import './ConversationList.css';
import { FaUsers, FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const ConversationList = ({ conversations, selectedConvoId, onConvoClick }) => {
  const handleConvoClick = async (convo) => {
    if (convo.isFollowingSuggestion) {
      // Create a new conversation with the following user
      try {
        const userId = convo.participants[0]._id;
        const { data } = await axios.post('/api/conversations', {
          type: 'dm',
          participants: [userId]
        });

        // Call onConvoClick with the new conversation ID
        onConvoClick(data._id);
      } catch (error) {
        console.error('Error creating conversation:', error);
        // Fallback to original behavior if creation fails
        onConvoClick(convo.id);
      }
    } else {
      onConvoClick(convo.id);
    }
  };

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
            className={`convo-item ${convo.id === selectedConvoId ? 'active' : ''} ${convo.isFollowingSuggestion ? 'following-suggestion' : ''}`}
            onClick={() => handleConvoClick(convo)}
          >
            <div className="convo-avatar-wrapper">
              {convo.type === 'dm' ? (
                <img src={convo.avatar} alt={convo.name} className="convo-avatar-img" />
              ) : (
                <div className="convo-group-icon"><FaUsers /></div>
              )}
              {convo.online && <div className="online-indicator"></div>}
              {convo.isFollowingSuggestion && (
                <div className="following-indicator">
                  <FaPlus />
                </div>
              )}
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
