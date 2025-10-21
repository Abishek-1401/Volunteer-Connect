import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import './EditProfilePage.css';

const EditProfilePage = () => {
  // In a real app, you'd fetch this data based on the logged-in user
  const [profileData, setProfileData] = useState({
    name: 'Abishek',
    title: 'MERN Stack Developer | Community Volunteer',
    bio: 'Passionate MERN stack developer creating impactful web applications.',
    skills: 'React, Node.js, MongoDB, Express', // We'll use a simple comma-separated string for now
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future, you'll send a PUT request to your backend here
    console.log('Updated Profile Data:', profileData);
    showToast('Profile updated successfully!', 'success');
    navigate('/profile'); // Redirect back to the profile page
  };

  return (
    <div className="edit-profile-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="edit-profile-container">
        <div className="edit-profile-card">
          <h1>Edit Your Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="title">Title / Headline</label>
              <input type="text" id="title" name="title" value={profileData.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" rows="5" value={profileData.bio} onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input type="text" id="skills" name="skills" value={profileData.skills} onChange={handleChange} />
              <small>Enter your skills separated by commas.</small>
            </div>
            <div className="form-actions">
              <Link to="/profile" className="cancel-btn">Cancel</Link>
              <button type="submit" className="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;