import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ProjectFilter from '../../components/ProjectFilter/ProjectFilter';
import { useToast } from '../../context/ToastContext';
import './ProjectHubPage.css';

const ProjectHubPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', location: '' });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        showToast('Failed to load projects. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showToast]);

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
      result = result.filter(p => p.location.toLowerCase().includes(location));
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
            {loading ? (
              <p>Loading projects...</p>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map(project => <ProjectCard key={project._id} project={project} />)
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