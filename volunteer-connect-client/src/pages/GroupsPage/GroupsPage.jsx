import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './GroupsPage.css';
import { FaUsers, FaPlus } from 'react-icons/fa';

// Mock data for existing groups
const mockGroups = [
  { id: '1', name: 'Beach Cleanup Crew', members: 45, description: 'Cleaning up our shores, one beach at a time.' },
  { id: '2', name: 'Local Food Bank Volunteers', members: 128, description: 'Fighting Hunger Together in our community.' },
  { id: '3', name: 'Tech Mentors for Kids', members: 22, description: 'Teaching the next generation of innovators.' },
];

const GroupsPage = () => {
  return (
    <div className="groups-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="groups-container">
        <div className="groups-header">
          <h1>Groups</h1>
          <Link to="/groups/create" className="create-group-btn">
            <FaPlus /> Create New Group
          </Link>
        </div>
        <div className="group-list-grid">
          {mockGroups.map(group => (
            <Link to={`/groups/${group.id}`} key={group.id} className="group-card-link">
              <div className="group-card-item">
                <div className="group-card-icon"><FaUsers /></div>
                <h3 className="group-card-name">{group.name}</h3>
                <p className="group-card-members">{group.members} members</p>
                <p className="group-card-desc">{group.description}</p>
                <div className="group-card-join-btn">View Group</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GroupsPage;