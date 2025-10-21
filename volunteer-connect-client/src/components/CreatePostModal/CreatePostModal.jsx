import React, { useState } from 'react';
import axios from 'axios';
import './CreatePostModal.css';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { FaTimes, FaUserCircle, FaImage, FaUserTag } from 'react-icons/fa';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [content, setContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPostImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // This function now handles all state cleanup
  const handleClose = () => {
    setContent('');
    setPostImage(null);
    setIsSubmitting(false); // Reset submitting state here
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Post content cannot be empty.', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Make the API call
      await axios.post('/api/posts', { content });

      // 2. If successful, tell the parent to refetch and close the modal
      onPostCreated(); 
      onClose(); 

      // 3. Finally, show the success message
      showToast('Post created successfully!', 'success');

    } catch (err) {
      console.log("Failed to create post:", err);
      showToast('Failed to create post.', 'error');
      setIsSubmitting(false); // Only re-enable on failure
    }
    // We no longer need a finally block
  };

  if (!isOpen) return null;

  const firstName = user ? user.name.split(' ')[0] : 'User';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>Create Post</h2>
            <button type="button" className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-user-info">
              <FaUserCircle className="modal-avatar" />
              <span>{user ? user.name : 'User'}</span>
            </div>
            <textarea
              className="modal-textarea"
              placeholder={`What's on your mind, ${firstName}?`}
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {postImage && (
              <div className="image-preview">
                <img src={postImage} alt="Post preview" />
                <button type="button" className="remove-image-btn" onClick={() => setPostImage(null)}>✕</button>
              </div>
            )}
          </div>
          <div className="modal-actions">
            <div className="action-icons">
              <label htmlFor="post-image-upload" className="modal-action-button">
                <FaImage style={{ color: '#45bd62' }} /> Photo/Video
              </label>
              <input 
                id="post-image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
              <button type="button" className="modal-action-button">
                <FaUserTag style={{ color: '#1877f2' }} /> Tag people
              </button>
            </div>
            <button 
              type="submit" 
              className="modal-post-button" 
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;