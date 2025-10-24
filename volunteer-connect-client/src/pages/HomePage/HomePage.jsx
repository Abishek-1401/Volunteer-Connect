import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Correct hook for auth
import Navbar from '../../components/Navbar/Navbar';
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';
import CreatePost from '../../components/CreatePost/CreatePost';
import Post from '../../components/Post/Post';
import RightSidebar from '../../components/RightSidebar/RightSidebar';
import './HomePage.css';

const HomePage = () => {
  const { user, logout, token } = useAuth(); // Get user, logout, and token from AuthContext
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    // No need to check token here, AuthProvider does it.
    // We just need to make sure axios defaults are set OR pass the token manually
    // AuthProvider already sets axios defaults if token exists.
    try {
      setLoading(true);
      const { data } = await axios.get('/api/posts'); // Uses proxy from vite.config.js
      setPosts(data);
      setError('');
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError('Failed to load posts.');
      if (err.response && err.response.status === 401) {
        logout(); // Logout if token is invalid
      }
    } finally {
      setLoading(false);
    }
  }, [logout]); // fetchPosts depends on logout

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchPosts(); // Fetch posts if user is logged in
    }
  }, [user, navigate, fetchPosts]);

  const handlePostCreated = (newPost) => {
    // Add the new post to the top of the feed, populated with user info
    const postWithUser = { ...newPost, user: { _id: user.id, name: user.name, profileImage: user.profileImage } };
    setPosts(currentPosts => [postWithUser, ...currentPosts]);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(p => p._id !== deletedPostId));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-page">
      <Navbar />
      <main className="home-container">
        <LeftSidebar /> {/* Your LeftSidebar component */}
        
        <div className="feed"> {/* Center column */}
          <CreatePost onPostCreated={handlePostCreated} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && posts.length === 0 && <p>No posts yet. Follow users or create one!</p>}
          {!loading && posts.map((post) => (
            <Post key={post._id} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </div>

        <RightSidebar /> {/* Your RightSidebar component */}
      </main>
    </div>
  );
};

export default HomePage;