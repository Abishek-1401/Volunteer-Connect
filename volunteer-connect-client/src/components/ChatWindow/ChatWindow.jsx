import React, { useState } from 'react';
import './ChatWindow.css';
import MessageInputForm from '../MessageInputForm/MessageInputForm'; // Import the new form
import { FaEllipsisH, FaCheckDouble } from 'react-icons/fa';

const ChatWindow = ({ conversation, messages, isEmbedded = false }) => {
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
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender.name === 'You' ? 'sent' : 'received'}`}>
            {msg.sender.name !== 'You' && <img src={msg.sender.avatar} alt={msg.sender.name} className="message-avatar" />}
            <div className="message-bubble-container">
              <div className="message-bubble">{msg.text}</div>
              {msg.sender.name === 'You' && (
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
            {msg.sender.name === 'You' && msg.status && (
              <div className={`message-status ${msg.status}`}>
                <FaCheckDouble />
              </div>
            )}
          </div>
        ))}
      </div>
      <MessageInputForm placeholder={`Message ${conversation.name}`} />
    </section>
  );
};

export default ChatWindow;