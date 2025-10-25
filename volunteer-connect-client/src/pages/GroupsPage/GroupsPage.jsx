import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import './GroupsPage.css';
import { FaUsers, FaPlus } from 'react-icons/fa';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axios.get('/api/groups');
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        showToast('Failed to load groups', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [showToast]);

  if (loading) {
    return (
      <div className="groups-page">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="groups-container">
          <div className="loading">Loading groups...</div>
        </main>
      </div>
    );
  }

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
          {groups.length === 0 ? (
            <div className="no-groups">No groups found. Be the first to create one!</div>
          ) : (
            groups.map(group => (
              <Link to={`/groups/${group._id}`} key={group._id} className="group-card-link">
                <div className="group-card-item">
                  <div className="group-card-icon"><FaUsers /></div>
                  <h3 className="group-card-name">{group.name}</h3>
                  <p className="group-card-members">{group.members.length} members</p>
                  <p className="group-card-desc">{group.description}</p>
                  <div className="group-card-join-btn">View Group</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupsPage;