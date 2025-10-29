import React, { useState, useEffect, useContext } from 'react';
import './ChatWindow.css';
import MessageInputForm from '../MessageInputForm/MessageInputForm'; // Import the new form
import ImageModal from '../ImageModal/ImageModal';
import { FaEllipsisH, FaCheckDouble } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const ChatWindow = ({ conversation, messages, isEmbedded = false, isLoading = false, onMessageSent }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [localMessages, setLocalMessages] = useState(messages);
  const [selectedImage, setSelectedImage] = useState(null);
  const { socket, user } = useContext(AuthContext);

  // Update local messages when messages prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Join conversation room when conversation ID changes
  useEffect(() => {
    if (socket && conversation?.id) {
      socket.emit('joinConversation', conversation.id);
      console.log(`Joined conversation room: ${conversation.id}`);

      return () => {
        socket.emit('leaveConversation', conversation.id);
        console.log(`Left conversation room: ${conversation.id}`);
      };
    }
  }, [socket, conversation?.id]);

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        console.log('Received message via socket:', message);
        // Add the message to the local messages state if it's not from current user
        if (message.sender.id !== user?.id) {
          setLocalMessages(prev => [...prev, message]);
        }
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messageList = document.querySelector('.message-list-new');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [localMessages]);

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
        ) : localMessages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          localMessages.map((msg) => {
            const isFromCurrentUser = msg.isFromCurrentUser !== undefined ? msg.isFromCurrentUser : msg.sender.id === user?.id;
            return (
              <div key={msg.id} className={`message-wrapper ${isFromCurrentUser ? 'sent' : 'received'}`}>
              {!isFromCurrentUser && <img src={msg.sender.avatar} alt={msg.sender.name} className="message-avatar" />}
              <div className="message-bubble-container">
                {msg.messageType === 'image' ? (
                  <div className="message-bubble message-image-bubble">
                    <img
                      src={msg.text}
                      alt={msg.fileName || 'Uploaded image'}
                      className="message-image"
                      onClick={() => setSelectedImage({ src: msg.text, alt: msg.fileName || 'Uploaded image' })}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ) : msg.messageType === 'file' ? (
                  <div className="message-bubble message-file-bubble">
                    <div className="file-info">
                      <div className="file-icon">📄</div>
                      <div className="file-details">
                        <div className="file-name">{msg.fileName || 'Document'}</div>
                        <div className="file-size">Click to download</div>
                      </div>
                    </div>
                    <a href={msg.text} target="_blank" rel="noopener noreferrer" className="file-download-btn">
                      Download
                    </a>
                  </div>
                ) : (
                  <div className="message-bubble">{msg.text}</div>
                )}
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {isFromCurrentUser && (
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
              {isFromCurrentUser && msg.status && (
                <div className={`message-status ${msg.status}`}>
                  <FaCheckDouble />
                </div>
              )}
            </div>
            );
          })
        )}
      </div>
      <MessageInputForm
        placeholder={`Message ${conversation.name}`}
        conversationId={conversation.id}
        onMessageSent={onMessageSent}
      />
      {selectedImage && (
        <ImageModal
          imageSrc={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
};

export default ChatWindow;