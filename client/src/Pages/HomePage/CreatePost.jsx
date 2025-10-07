import React from 'react';
import profilePic from '../../assets/slider1.jpg';

const CreatePost = () => (
  <div className="card create-post">
    <div className="post-header">
      <img src={profilePic} alt="Your profile" />
      <input type="text" placeholder="Share something..." style={{ flex: 1, border: 'none', background: '#f8f9fa', padding: '0.75rem', borderRadius: '20px' }} />
    </div>
  </div>
);

export default CreatePost;