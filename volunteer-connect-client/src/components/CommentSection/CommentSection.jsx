import React, { useState, useEffect, useContext } from 'react';
import './CommentSection.css';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

// Mock comments - in a real app, you'd fetch this
const mockComments = {
  '1': [{ user: 'Cody Fisher', text: 'This is a great initiative!' }],
  '2': [{ user: 'Jane Doe', text: 'Amazing work, team.' }],
};

const CommentSection = ({ postId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Simulate fetching comments for the given post ID
    setComments(mockComments[postId] || []);
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Add the new comment to the list (frontend only)
      setComments([...comments, { user: user?.name || 'You', text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmit}>
        <FaUserCircle className="comment-avatar" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit"><FaPaperPlane /></button>
      </form>
      <div className="comment-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <FaUserCircle className="comment-avatar" />
            <div className="comment-bubble">
              <strong>{comment.user}</strong>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
