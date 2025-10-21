import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import HomeNavbar from '../../components/HomeNavbar'; // Use HomeNavbar
import ProfileCard from './ProfileCard'; // From HomePage folder
import CreatePost from '../../components/CreatePost'; // Assuming this is your create post component
import Post from '../../components/Post'; // Your Post component
import People from './People'; // From HomePage folder
import Group from './Group'; // From HomePage folder
import './HomePage.css'; // Styles for the layout

const HomePage = () => {
  const { user, logout } = useContext(UserContext); // Get user from context
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // State to hold fetched posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Example user data for ProfileCard (replace with actual context data if needed)
  const currentUser = {
    name: user?.name || 'Loading...', // Use name from context or default
    handle: user?.email || '', // Example handle using email
    profileImage: user?.profileImage || '/default-avatar.jpg', // Use profile image from context or default
    stats: {
      followers: '...', // Fetch or pass these stats
      following: '...',
    },
    skills: user?.skills || [], // Example skills
    bio: user?.bio || '', // Example bio
  };

  useEffect(() => {
    // Redirect to login if user is not available from context
    if (!user) {
      navigate('/login');
    } else {
      fetchPosts(); // Fetch posts if user is logged in
    }
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/posts', config);
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
  };

  const handlePostCreated = (newPost) => {
    // Add the new post to the top of the feed
    setPosts([newPost, ...posts]);
    // Optionally refetch posts: fetchPosts();
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(p => p._id !== deletedPostId));
  };

  if (loading && !user) return <div>Loading...</div>; // Show loader if still checking auth

  return (
    <div className="home-page">
      <HomeNavbar user={user} logout={logout} />
      <main className="home-container">
        <aside className="left-column">
          <ProfileCard user={currentUser} />
        </aside>

        <section className="middle-column">
          <CreatePost onPostCreated={handlePostCreated} /> {/* Pass handler to add new post */}
          {loading && <p>Loading posts...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && posts.length === 0 && <p>No posts yet. Follow users or create one!</p>}
          {!loading && posts.map((post) => (
            <Post key={post._id} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </section>

        <aside className="right-column">
          <People />
          <Group />
        </aside>
      </main>
    </div>
  );
};

export default HomePage;