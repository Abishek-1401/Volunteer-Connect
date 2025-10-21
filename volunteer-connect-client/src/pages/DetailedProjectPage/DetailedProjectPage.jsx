import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { FaMapMarkerAlt, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import './DetailedProjectPage.css';

// --- Mock Data ---
const mockProjects = [
  { id: '1', title: 'Community Garden Initiative', description: 'We are starting a new community garden to grow fresh produce for local shelters. We need help with planting, watering, and general setup. No experience necessary! This is a great opportunity to learn about urban farming and contribute to a healthier community.', tags: ['environment', 'gardening', 'community'], location: { address: 'Coimbatore, TN' }, eventDate: '2025-10-25', organizer: { name: 'Eleanor Pena' }, participants: [{name: 'Cody Fisher'}, {name: 'Jane Doe'}] },
  { id: '2', title: 'Tech Skills Workshop for Kids', description: 'Host a fun workshop to teach basic coding skills to underprivileged children. We need mentors who are familiar with Scratch or basic Python. The goal is to spark interest in technology and provide valuable skills for the future.', tags: ['education', 'tech', 'children'], location: { address: 'Chennai, TN' }, eventDate: '2025-11-10', organizer: { name: 'Cody Fisher' }, participants: [{name: 'You'}] },
  { id: '3', title: 'Beach Cleanup Drive', description: 'Join us this Saturday to clean up Marina Beach. Let\'s work together to protect our marine ecosystem. Gloves and bags will be provided. Come and make a tangible difference!', tags: ['environment', 'ocean', 'community'], location: { address: 'Chennai, TN' }, eventDate: '2025-11-01', organizer: { name: 'Jane Doe' }, participants: [] },
];

const DetailedProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Find the project from our mock data based on the ID from the URL
    const foundProject = mockProjects.find(p => p.id === projectId);
    setProject(foundProject);
  }, [projectId]);

  const handleJoin = () => {
    // In a real app, this would be an API call
    console.log(`Joining project ${projectId}`);
    setHasJoined(true);
  };

  if (!project) {
    return (
      <div className="detailed-project-page">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="project-detail-container">
          <p>Loading project or project not found...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="detailed-project-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="project-detail-container">
        <div className="project-detail-layout">
          {/* --- Left Column --- */}
          <div className="project-main-content">
            <h1 className="project-detail-title">{project.title}</h1>
            <div className="project-organizer-info">
              <FaUserCircle />
              <span>Organized by <strong>{project.organizer.name}</strong></span>
            </div>
            <div className="project-detail-tags">
              {project.tags.map(tag => <span key={tag} className="tag-item">{tag}</span>)}
            </div>
            <h3 className="section-title">Description</h3>
            <p className="project-full-desc">{project.description}</p>
          </div>

          {/* --- Right Column --- */}
          <div className="project-sidebar">
            <div className="info-card">
              <div className="info-item">
                <FaCalendarAlt />
                <div>
                  <strong>Date</strong>
                  <span>{new Date(project.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt />
                <div>
                  <strong>Location</strong>
                  <span>{project.location.address}</span>
                </div>
              </div>

              {hasJoined ? (
                <Link to={`/projects/${projectId}/dashboard`} className="join-button">
                  View Dashboard
                </Link>
              ) : (
                <button className="join-button" onClick={handleJoin}>
                  Join Project
                </button>
              )}
            </div>

            <div className="participants-card">
              <h4 className="section-title">Participants ({project.participants.length})</h4>
              <ul className="participants-list">
                {project.participants.map((p, index) => (
                  <li key={index}><FaUserCircle /> {p.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailedProjectPage;