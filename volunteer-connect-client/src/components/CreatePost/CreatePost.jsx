import React, { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';
// import { useToast } from '../../context/ToastContext'; // Temporarily disabled
import { FaUserCircle, FaImage } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  // const { showToast } = useToast(); // Temporarily disabled
  // Auth token is already set on axios defaults by AuthProvider

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
    try {
      // AuthProvider already set the token header
      await axios.post('/api/posts', { content });
      alert('Post created successfully!');
      setContent(''); // Clear the text area
      onPostCreated(); // Refresh posts
    } catch (err) {
      console.error("Failed to create post:", err);
      alert(err.response?.data?.message || 'Failed to create post.');
    }
  };

  return (
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