import React from 'react';
import postImage from '../../assets/slider1.jpg'; // Add a post image to your assets
import authorPic from '../../assets/slider2.jpg'; // Add another profile picture


const Post = () => (
  <div className="card post">
    <div className="post-header">
      <img src={authorPic} alt="Briansky" />
      <div>
        <strong>Briansky</strong>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '0.8rem' }}>12 minutes ago</p>
      </div>
    </div>
    <p>Beautiful art! #art #aesthetics #photography</p>
    <img src={postImage} alt="Art post" className="post-image" />
    <div className="post-actions">
      <span>❤️ 320k</span>
      <span>💬 120</span>
      <span>🔗 148</span>
    </div>
  </div>
);

export default Post;