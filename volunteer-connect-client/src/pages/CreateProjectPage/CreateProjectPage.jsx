import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import './CreateProjectPage.css';

const CreateProjectPage = () => {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tags: '',
    location: '',
    eventDate: '',
  });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Project Data:', {
        ...projectData,
        tags: projectData.tags.split(',').map(tag => tag.trim()) // Convert string to array
    });
    showToast('Project created successfully!', 'success');
    navigate('/projects'); // Redirect back to the project hub
  };

  return (
    <div className="create-project-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="create-project-container">
        <div className="create-project-card">
          <h1>Create a New Project</h1>
          <p className="form-subtitle">Inspire action by starting a new initiative in your community.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input type="text" id="title" name="title" value={projectData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="6" value={projectData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags / Skills Needed</label>
              <input type="text" id="tags" name="tags" value={projectData.tags} onChange={handleChange} />
              <small>Enter skills or categories separated by commas (e.g., gardening, education, tech).</small>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" name="location" placeholder="e.g., Coimbatore, TN" value={projectData.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="eventDate">Date of Event</label>
                    <input type="date" id="eventDate" name="eventDate" value={projectData.eventDate} onChange={handleChange} required />
                </div>
            </div>
            <div className="form-actions">
              <Link to="/projects" className="cancel-btn">Cancel</Link>
              <button type="submit" className="save-btn">Publish Project</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProjectPage;