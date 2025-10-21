import React, { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { FaUserCircle, FaImage } from 'react-icons/fa';

// It now needs to receive a prop to tell the feed to refresh
const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Post content cannot be empty.', 'error');
      return;
    }
    try {
      await axios.post('/api/posts', { content });
      showToast('Post created successfully!', 'success');
      setContent(''); // Clear the text area
      onPostCreated(); // Tell the feed to refetch posts
    } catch (err) {
      console.error("Failed to create post:", err);
      showToast('Failed to create post.', 'error');
    }
  };

  return (
    // Wrap the component in a form
    <form className="create-post-container" onSubmit={handleSubmit}>
      <div className="create-post-header">
        <FaUserCircle className="create-post-avatar" />
        <textarea 
          placeholder="Start a post..." 
          className="create-post-textarea" 
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="create-post-actions">
        <label htmlFor="file-upload" className="action-button">
          <FaImage />
          <span>Photo</span>
        </label>
        <input id="file-upload" type="file" accept="image/*" style={{display: 'none'}} />
        <button type="submit" className="post-button" disabled={!content.trim()}>
          Post
        </button>
      </div>
    </form>
  );
};

export default CreatePost;