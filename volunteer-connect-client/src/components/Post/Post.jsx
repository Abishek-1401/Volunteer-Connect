import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Assuming you have this
import './Post.css'; // You'll need to create styles for this

// Placeholder components for icons
const LikeIcon = () => <span>❤️</span>;
const CommentIcon = () => <span>💬</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;

const Post = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user } = useContext(UserContext); // Get current user info
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(likes.includes(user?._id)); // Check if current user liked

  const getTokenConfig = () => {
    const token = localStorage.getItem('userToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLike = async () => {
    if (!user) return; // Prevent liking if not logged in
    try {
      const config = getTokenConfig();
      // Assuming your backend returns the updated likes array
      const { data: updatedLikes } = await axios.put(`/api/posts/${post._id}/like`, {}, config);
      setLikes(updatedLikes);
      setIsLiked(updatedLikes.includes(user._id));
    } catch (error) {
      console.error("Error liking post:", error);
      // Show error toast/notification
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      const config = getTokenConfig();
      // Assuming backend returns the full updated comments array
      const { data: updatedComments } = await axios.post(`/api/posts/${post._id}/comments`, { text: newComment }, config);
      setComments(updatedComments); // Update comments in state
      setNewComment(''); // Clear input
    } catch (error) {
      console.error("Error adding comment:", error);
      // Show error toast/notification
    }
  };

  const handleDelete = async () => {
    if (!user || user._id !== post.user._id) return; // Only allow author to delete

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const config = getTokenConfig();
        await axios.delete(`/api/posts/${post._id}`, config);
        if (onPostDeleted) {
          onPostDeleted(post._id); // Notify parent component to remove post from state
        }
        // Show success toast/notification
      } catch (error) {
        console.error("Error deleting post:", error);
        // Show error toast/notification
      }
    }
  };

  // Basic check to see if the current user is the author
  const isAuthor = user && post.user && user._id === post.user._id;

  return (
    <div className="post-card card"> {/* Use card style */}
      <div className="post-header">
        <img src={post.user?.profileImage || '/default-avatar.jpg'} alt={post.user?.name} className="user-avatar" />
        <div>
          <strong>{post.user?.name || 'User'}</strong>
          <p>{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {/* Basic options menu - could be a dropdown */}
        {isAuthor && (
          <div className="post-options">
            <button onClick={() => {/* Implement edit logic, maybe open modal */}}> <EditIcon /> </button>
            <button onClick={handleDelete}> <DeleteIcon /> </button>
          </div>
        )}
      </div>

      <p className="post-content">{post.content}</p>
      {post.image && <img src={post.image} alt="Post content" className="post-image" />}

      <div className="post-actions">
        <button onClick={handleLike} className={`like-button ${isLiked ? 'liked' : ''}`}>
          <LikeIcon /> {likes.length} Likes
        </button>
        <span><CommentIcon /> {comments.length} Comments</span>
      </div>

      <div className="comment-section">
        {/* Display existing comments */}
        {comments.slice(0, 2).map((comment) => ( // Show first 2 comments
          <div key={comment._id} className="comment">
            <strong>{comment.user?.name || 'User'}:</strong> {comment.text}
          </div>
        ))}
        {comments.length > 2 && <p>View all {comments.length} comments...</p>}

        {/* Add comment form */}
        {user && (
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={!newComment.trim()}>Post</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Post;