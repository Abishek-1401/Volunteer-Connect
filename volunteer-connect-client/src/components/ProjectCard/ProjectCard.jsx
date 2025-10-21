import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <FaUserCircle className="organizer-avatar" />
        <div>
          <span className="organizer-name">{project.organizer.name}</span>
          <span className="posted-time">posted 2 hours ago</span>
        </div>
      </div>
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-desc">{project.description.substring(0, 120)}...</p>
      <div className="project-card-tags">
        {project.tags.map(tag => <span key={tag} className="tag-item">{tag}</span>)}
      </div>
      <div className="project-card-footer">
        <div className="location-info">
          <FaMapMarkerAlt />
          <span>{project.location.address}</span>
        </div>
        <Link to={`/projects/${project.id}`} className="details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;