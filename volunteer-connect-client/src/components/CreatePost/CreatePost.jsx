import React, { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';
// import { useToast } from '../../context/ToastContext'; // Temporarily disabled
import { FaUserCircle, FaImage, FaFile } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileConfirm, setShowFileConfirm] = useState(false);
  // const { showToast } = useToast(); // Temporarily disabled
  // Auth token is already set on axios defaults by AuthProvider

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowFileConfirm(true);
    }
  };

  const handleFileConfirm = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileUrl = uploadResponse.data.fileUrl;
      const fileName = selectedFile.name;

      // Create post with file
      const postData = {
        content,
        fileUrl,
        fileName,
        fileType: selectedFile.type.startsWith('image/') ? 'image' : 'file'
      };

      const response = await axios.post('/api/posts', postData);
      alert('Post created successfully!');
      setContent('');
      setSelectedFile(null);
      setShowFileConfirm(false);
      onPostCreated(response.data);
    } catch (err) {
      console.error("Failed to create post:", err);
      alert(err.response?.data?.message || 'Failed to create post.');
    }
  };

  const handleFileCancel = () => {
    setSelectedFile(null);
    setShowFileConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
    try {
      // AuthProvider already set the token header
      const response = await axios.post('/api/posts', { content });
      alert('Post created successfully!');
      setContent(''); // Clear the text area
      onPostCreated(response.data); // Pass the new post for optimistic update
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
        <input id="file-upload" type="file" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={handleFileSelect} style={{display: 'none'}} />
        <button type="submit" className="post-button" disabled={!content.trim()}>
          Post
        </button>
      </div>

      {showFileConfirm && selectedFile && (
        <div className="file-confirm-modal">
          <div className="file-confirm-content">
            <h3>Confirm File Upload</h3>
            <div className="file-info">
              <div className="file-type">
                {selectedFile.type.startsWith('image/') ? '📷 Image' : '📄 Document'}
              </div>
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              <div className="file-preview">
                {selectedFile.type.startsWith('image/') ? 'Will be displayed in your post' : 'Will be available for download'}
              </div>
            </div>
            <div className="file-confirm-actions">
              <button onClick={handleFileCancel} className="cancel-btn">Cancel</button>
              <button onClick={handleFileConfirm} className="confirm-btn">Upload & Post</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CreatePost;