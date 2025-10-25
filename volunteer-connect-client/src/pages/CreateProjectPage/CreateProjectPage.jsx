import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import './CreateProjectPage.css';

const CreateProjectPage = () => {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tags: '',
    location: '',
    eventDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!projectData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (projectData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (projectData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!projectData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (projectData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (projectData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!projectData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!projectData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(projectData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      showToast('Please log in to create a project', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...projectData,
          tags: projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Project created successfully!', 'success');
        navigate('/projects');
      } else {
        if (data.msg) {
          showToast(data.msg, 'error');
        } else {
          showToast('Failed to create project', 'error');
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
              <button type="submit" className="save-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Project'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProjectPage;