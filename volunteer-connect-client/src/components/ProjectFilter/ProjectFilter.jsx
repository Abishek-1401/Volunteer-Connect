import React from 'react';
import './ProjectFilter.css';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const ProjectFilter = ({ filters, onFilterChange }) => {
  return (
    <aside className="project-filter-panel">
      <h4>Filter Projects</h4>
      <div className="filter-group">
        <label htmlFor="keyword">Keyword</label>
        <div className="filter-input-wrapper">
          <FaSearch />
          <input 
            type="text" 
            id="keyword" 
            name="keyword" 
            placeholder="e.g., 'Education'"
            value={filters.keyword}
            onChange={onFilterChange}
          />
        </div>
      </div>
      <div className="filter-group">
        <label htmlFor="location">Location</label>
        <div className="filter-input-wrapper">
          <FaMapMarkerAlt />
          <input 
            type="text" 
            id="location" 
            name="location" 
            placeholder="e.g., 'Coimbatore'"
            value={filters.location}
            onChange={onFilterChange}
          />
        </div>
      </div>
    </aside>
  );
};

export default ProjectFilter;