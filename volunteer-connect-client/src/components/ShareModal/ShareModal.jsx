import React, { useState } from 'react';
import './ShareModal.css';
import { FaTimes, FaLink } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';

const ShareModal = ({ post, onClose }) => {
  const { showToast } = useToast();
  const [copyText, setCopyText] = useState('Copy');
  // In a real app, this URL would be the actual post's URL
  const postUrl = `${window.location.origin}/posts/${post.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopyText('Copied!');
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopyText('Copy'), 2000); // Revert after 2 seconds
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>Share Post</h3>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
        </div>
        <p>Share this link with others to view this post.</p>
        <div className="share-link-wrapper">
          <FaLink />
          <input type="text" readOnly value={postUrl} />
          <button onClick={handleCopy}>{copyText}</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;