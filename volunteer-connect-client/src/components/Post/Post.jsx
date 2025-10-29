import React, { useState, useContext, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Use correct context
import { useToast } from '../../context/ToastContext'; // For feedback
import ShareModal from '../ShareModal/ShareModal'; // Import ShareModal
import CommentSection from '../CommentSection/CommentSection'; // Import CommentSection for modal
import './Post.css';

// Placeholder Icons
const LikeIcon = () => <span>❤️</span>;
const CommentIcon = () => <span>💬</span>;
const ShareIcon = () => <span>📤</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const ThreeDotsIcon = () => <span>⋮</span>;
const FollowIcon = () => <span>👤+</span>;
const UnfollowIcon = () => <span>👤-</span>;

const Post = ({ post, onPostDeleted }) => {
  // Use AuthContext for user info
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  // Local state for post data to allow editing
  const [currentPost, setCurrentPost] = useState(post);
  const [likes, setLikes] = useState(currentPost.likes || []);
  const [comments, setComments] = useState(currentPost.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false); // Initialize false, check in useEffect

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(currentPost.content);

  // State for share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // State for comment modal
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // State for showing inline comments
  const [showComments, setShowComments] = useState(false);

  // State for options menu
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  // State for follow status (assuming we need to track this)
  // const [isFollowing, setIsFollowing] = useState(false); // Placeholder, need to implement follow logic

  // Update local state when post prop changes
  useEffect(() => {
    setCurrentPost(post);
    setLikes(post.likes || []);
    setComments(post.comments || []);
  }, [post]);

  // Check if liked when user or likes change
  useEffect(() => {
    setIsLiked(likes.some(like => like === user?._id));
  }, [likes, user]);

  const getTokenConfig = () => {
    const token = localStorage.getItem('token'); // Use 'token' from AuthProvider
    if (!token) {
      console.error("No token found"); // Or handle logout
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLike = async () => {
    const config = getTokenConfig();
    if (!user || !config) return;
    try {
      const { data: updatedLikes } = await axios.put(`/api/posts/${currentPost._id}/like`, {}, config);
      setLikes(updatedLikes);
      // isLiked state is updated via useEffect
    } catch (error) {
      console.error("Error liking post:", error);
      showToast('Could not update like.', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const config = getTokenConfig();
    if (!newComment.trim() || !user || !config) return;
    try {
      const { data: updatedComments } = await axios.post(`/api/posts/${currentPost._id}/comments`, { text: newComment }, config);
      setComments(updatedComments);
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast('Could not add comment.', 'error');
    }
  };

  const handleDelete = async () => {
    const config = getTokenConfig();
    if (!user || user._id !== currentPost.user?._id || !config) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${currentPost._id}`, config);
        if (onPostDeleted) {
          onPostDeleted(currentPost._id);
        }
        showToast('Post deleted.', 'success');
      } catch (error) {
        console.error("Error deleting post:", error);
        showToast('Could not delete post.', 'error');
      }
    }
  };

  // --- Edit Functionality ---
  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedContent(currentPost.content); // Reset edit field on opening
    }
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    const config = getTokenConfig();
    if (!editedContent.trim() || !user || !config) return;

    try {
      const { data: updatedPostData } = await axios.put(`/api/posts/${currentPost._id}`, { content: editedContent }, config);
      setCurrentPost(updatedPostData); // Update local post state
      setIsEditing(false); // Exit edit mode
      showToast('Post updated!', 'success');
      // No need for onPostUpdated prop if managing state locally
    } catch (error) {
      console.error("Error updating post:", error);
      showToast('Could not update post.', 'error');
    }
  };

  const isAuthor = user && currentPost.user && user._id === currentPost.user._id;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-header-left">
          <img src={currentPost.user?.profileImage || '/default-avatar.jpg'} alt={currentPost.user?.name} className="user-avatar" />
          <div className="post-author-info">
            <div className="post-author-name">{currentPost.user?.name || 'User'}</div>
            <div className="post-timestamp">{new Date(currentPost.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div className="post-header-right">
          <button onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)} className="options-toggle-btn">
            <ThreeDotsIcon />
          </button>
          {isOptionsMenuOpen && (
            <div className="options-dropdown">
              {isAuthor ? (
                <>
                  <button onClick={handleEditToggle}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              ) : (
                <>
                  <button>Follow</button>
                  <button>Report</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="edit-post-section">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="edit-actions">
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-content">{currentPost.content}</div>
          {currentPost.fileUrl && currentPost.fileType === 'image' && (
            <img src={currentPost.fileUrl} alt={currentPost.fileName || "Post image"} className="post-image" />
          )}
          {currentPost.fileUrl && currentPost.fileType === 'file' && (
            <div className="post-file">
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <div className="file-name">{currentPost.fileName || 'Document'}</div>
                  <div className="file-size">Click to download</div>
                </div>
              </div>
              <a href={currentPost.fileUrl} target="_blank" rel="noopener noreferrer" className="file-download-btn">
                Download
              </a>
            </div>
          )}
        </>
      )}

      <div className="post-actions">
        <div className="post-actions-left">
          <button onClick={handleLike} className={`post-action-button ${isLiked ? 'liked' : ''}`}>
            <LikeIcon />
          </button>
          <button onClick={() => setShowComments(!showComments)} className="post-action-button">
            <CommentIcon />
          </button>
          <button onClick={() => setIsShareModalOpen(true)} className="post-action-button">
            <ShareIcon />
          </button>
        </div>
      </div>

      <div className="post-stats">
        {likes.length} {likes.length === 1 ? 'like' : 'likes'}
      </div>

      {showComments && (
        <div className="comment-section">
          {comments.slice(0, 2).map((comment) => (
            <div key={comment._id || comment.createdAt} className="comment">
              <strong>{comment.user?.name || 'User'}</strong> {comment.text}
            </div>
          ))}
          {comments.length > 2 && <p>View all {comments.length} comments...</p>}

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
      )}

      {isCommentModalOpen && (
        <CommentSection
          postId={currentPost._id}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}

      {isShareModalOpen && (
        <ShareModal
          post={currentPost}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Post;
