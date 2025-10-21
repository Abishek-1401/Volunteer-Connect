import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CreatePost from '../CreatePost/CreatePost'; // This is your inline form
import Post from '../Post/Post';
import ShareModal from '../ShareModal/ShareModal';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalPost, setShareModalPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    // We don't set loading to true here because that's for the initial page load
    try {
      const res = await axios.get('/api/posts');
      const formattedPosts = res.data.map(p => ({
          id: p._id,
          author: p.author ? p.author.name : 'Unknown User',
          content: p.content,
          likes: p.likes.length,
          comments: p.comments.length,
      }));
      setPosts(formattedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      if (loading) setLoading(false);
    }
  }, [loading]); // We add loading here to ensure setLoading is not stale

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="feed">
      {/* We now pass the onPostCreated prop to the inline CreatePost component.
        All the modal logic has been removed.
      */}
      <CreatePost onPostCreated={fetchPosts} />

      {loading ? (
        <div className="loading-container">
          <p>Loading posts...</p>
        </div>
      ) : (
        posts.length > 0 ? (
            posts.map(post => (
                <Post 
                    key={post.id} 
                    post={post}
                    onShareClick={(postToShare) => setShareModalPost(postToShare)}
                />
            ))
        ) : (
            <div className="empty-feed-message">
                <h3>No posts yet</h3>
                <p>Be the first one to share something with the community!</p>
            </div>
        )
      )}
      
      {shareModalPost && <ShareModal post={shareModalPost} onClose={() => setShareModalPost(null)} />}
    </div>
  );
};

export default Feed;