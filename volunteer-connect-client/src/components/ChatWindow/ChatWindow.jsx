import React, { useState } from 'react';
import './ChatWindow.css';
import MessageInputForm from '../MessageInputForm/MessageInputForm'; // Import the new form
import { FaEllipsisH, FaCheckDouble } from 'react-icons/fa';

const ChatWindow = ({ conversation, messages, isEmbedded = false, isLoading = false, onMessageSent }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (!conversation) return null;

  return (
    // Add a class when embedded to remove redundant styling
    <section className={`chat-panel ${isEmbedded ? 'embedded' : ''}`}>
      {!isEmbedded && (
        <header className="chat-panel-header">
          <div className="chat-header-info">
            <h4>{conversation.name}</h4>
            {conversation.online && <span className="chat-status-online">Active now</span>}
          </div>
        </header>
      )}
      <div className="message-list-new">
        {isLoading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.isFromCurrentUser ? 'sent' : 'received'}`}>
              {!msg.isFromCurrentUser && <img src={msg.sender.avatar} alt={msg.sender.name} className="message-avatar" />}
              <div className="message-bubble-container">
                <div className="message-bubble">{msg.text}</div>
                {msg.isFromCurrentUser && (
                  <div className="message-options">
                    <button className="options-btn" onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)}>
                      <FaEllipsisH />
                    </button>
                    {openMenuId === msg.id && (
                      <div className="options-menu">
                        <button>Edit</button>
                        <button className="delete">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {msg.isFromCurrentUser && msg.status && (
                <div className={`message-status ${msg.status}`}>
                  <FaCheckDouble />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <MessageInputForm
        placeholder={`Message ${conversation.name}`}
        conversationId={conversation.id}
        onMessageSent={onMessageSent}
      />
    </section>
  );
};

export default ChatWindow;