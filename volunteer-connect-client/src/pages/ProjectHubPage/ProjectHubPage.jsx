import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ProjectFilter from '../../components/ProjectFilter/ProjectFilter';
import './ProjectHubPage.css';

// --- Mock Data ---
const mockProjects = [
  { id: '1', title: 'Community Garden Initiative', description: 'We are starting a new community garden to grow fresh produce for local shelters. We need help with planting, watering, and general setup. No experience necessary!', tags: ['environment', 'gardening', 'community'], location: { address: 'Coimbatore, TN' }, organizer: { name: 'Eleanor Pena' } },
  { id: '2', title: 'Tech Skills Workshop for Kids', description: 'Host a fun workshop to teach basic coding skills to underprivileged children. We need mentors who are familiar with Scratch or basic Python.', tags: ['education', 'tech', 'children'], location: { address: 'Chennai, TN' }, organizer: { name: 'Cody Fisher' } },
  { id: '3', title: 'Beach Cleanup Drive', description: 'Join us this Saturday to clean up Marina Beach. Let\'s work together to protect our marine ecosystem. Gloves and bags will be provided.', tags: ['environment', 'ocean', 'community'], location: { address: 'Chennai, TN' }, organizer: { name: 'Jane Doe' } },
];

const ProjectHubPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', location: '' });

  // Initial data load
  useEffect(() => {
    setProjects(mockProjects);
setFilteredProjects(mockProjects);
  }, []);

  // Effect to apply filters
  useEffect(() => {
    let result = projects;
    
    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      result = result.filter(p => p.location.address.toLowerCase().includes(location));
    }

    setFilteredProjects(result);
}, [filters, projects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="project-hub-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="hub-container">
        <div className="hub-header">
          <h1>Project Hub</h1>
          <p>Find and join projects that make a difference.</p>
          <Link to="/projects/create" className="create-project-btn">Create Project</Link>
        </div>
        <div className="hub-layout">
          <div className="project-feed">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)
            ) : (
              <p>No projects found matching your criteria.</p>
            )}
          </div>
          <ProjectFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </main>
    </div>
  );
};

export default ProjectHubPage;