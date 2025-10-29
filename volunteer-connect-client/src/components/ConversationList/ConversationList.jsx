import React, { useState } from 'react';
import './ConversationList.css';
import { FaUsers, FaSearch, FaPlus } from 'react-icons/fa';
import CreateGroupModal from '../CreateGroupModal/CreateGroupModal';

const ConversationList = ({ conversations, selectedConvoId, onConvoClick, onCreateGroup }) => {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const handleConvoClick = async (convo) => {
    if (convo.isFollowingSuggestion) {
      // Use the following- prefixed ID to start messaging
      onConvoClick(`following-${convo.participants[0]._id}`);
    } else {
      onConvoClick(convo.id);
    }
  };

  const handleCreateGroup = (groupData) => {
    onCreateGroup(groupData);
    setShowCreateGroupModal(false);
  };

  return (
    <>
      <aside className="conversation-list-panel">
        <div className="convo-list-header">
          <h2>Messages</h2>
          <div className="header-actions">
            <button
              className="create-group-btn"
              onClick={() => setShowCreateGroupModal(true)}
              title="Create Group"
            >
              <FaPlus />
            </button>
            <div className="convo-search-bar">
              <FaSearch />
              <input type="text" placeholder="Search messages" />
            </div>
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

      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onGroupCreated={handleCreateGroup}
      />
    </>
  );
};

export default ConversationList;
