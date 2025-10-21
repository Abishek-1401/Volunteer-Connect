import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import './CreateGroupPage.css';
import { FaGlobeAsia, FaLock } from 'react-icons/fa';

const CreateGroupPage = () => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
  });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Group Data:', groupData);
    showToast('Group created successfully!', 'success');
    navigate('/groups'); // Redirect back to the groups page
  };

  return (
    <div className="create-group-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="create-group-container">
        <div className="create-group-card">
          <h1>Create a New Group</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Group Name</label>
              <input type="text" id="name" name="name" value={groupData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="5" value={groupData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="form-group">
              <label>Privacy</label>
              <div className="privacy-options">
                <label className={`privacy-option ${groupData.privacy === 'public' ? 'selected' : ''}`}>
                  <input type="radio" name="privacy" value="public" checked={groupData.privacy === 'public'} onChange={handleChange} />
                  <FaGlobeAsia />
                  <div className="privacy-text">
                    <strong>Public</strong>
                    <span>Anyone can see who's in the group and what they post.</span>
                  </div>
                </label>
                <label className={`privacy-option ${groupData.privacy === 'private' ? 'selected' : ''}`}>
                  <input type="radio" name="privacy" value="private" checked={groupData.privacy === 'private'} onChange={handleChange} />
                  <FaLock />
                  <div className="privacy-text">
                    <strong>Private</strong>
                    <span>Only members can see who's in the group and what they post.</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="form-actions">
              <Link to="/groups" className="cancel-btn">Cancel</Link>
              <button type="submit" className="save-btn">Create Group</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateGroupPage;