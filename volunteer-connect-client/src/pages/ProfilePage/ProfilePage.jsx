import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Navbar from '../../components/HomeNavbar'; // Use HomeNavbar
import Post from '../../components/Post'; // Reuse Post component
import ProfileCard from '../HomePage/ProfileCard'; // Reuse ProfileCard
// import './ProfilePage.css'; // Add specific styles if needed

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMyPosts();
    }
  }, [user, navigate]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // You might need to create this backend route: GET /api/posts/myposts
      const { data } = await axios.get('/api/posts/myposts', config);
      setMyPosts(data);
      setError('');
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError('Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setMyPosts(currentPosts => currentPosts.filter(p => p._id !== deletedPostId));
  };

  if (!user) return <div>Redirecting...</div>;

  return (
    <div className="profile-page"> {/* Use appropriate class */}
      <Navbar user={user} logout={logout} />
      <main className="profile-container" style={{ maxWidth: '800px', margin: '100px auto 1rem auto', padding: '1rem' }}>
        
        {/* Display Profile Information (Could use ProfileCard or a dedicated header) */}
        {/* <ProfileCard user={user} /> */}
        <h2>Your Posts</h2>

        {loading && <p>Loading your posts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && myPosts.length === 0 && <p>You haven't created any posts yet.</p>}
        
        <div className="posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!loading && myPosts.map((post) => (
            // Pass the onPostDeleted handler to the Post component
            <Post key={post._id} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;