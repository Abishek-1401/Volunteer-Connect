import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import './GroupProfilePage.css';
import { FaUsers, FaUserCircle } from 'react-icons/fa';

const GroupProfilePage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchGroup = async () => {
    try {
      const { data } = await axios.get(`/api/groups/${groupId}`);
      setGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
      showToast('Failed to load group details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId, showToast]);

  const handleJoinGroup = async () => {
    if (!user) {
      showToast('Please login to join groups', 'error');
      return;
    }

    setJoining(true);
    try {
      const { data } = await axios.put(`/api/groups/${groupId}/join`);
      setGroup(data);
      showToast('Successfully joined the group!', 'success');
    } catch (error) {
      console.error('Error joining group:', error);
      const message = error.response?.data?.msg || 'Failed to join group';
      showToast(message, 'error');
    } finally {
      setJoining(false);
    }
  };

  const isMember = user && group?.members?.some(member => member._id === user._id);

  if (loading) {
    return (
      <div className="group-profile-page">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="group-profile-container">
          <div className="loading">Loading group details...</div>
        </main>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-profile-page">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="group-profile-container">
          <div className="error">Group not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="group-profile-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="group-profile-container">
        <header className="group-profile-header">
          <div className="group-header-icon"><FaUsers /></div>
          <h1>{group.name}</h1>
          <p>{group.members.length} members</p>
          <button
            className={`group-profile-join-btn ${isMember ? 'joined' : ''}`}
            onClick={handleJoinGroup}
            disabled={joining}
          >
            {joining ? 'Joining...' : isMember ? 'Joined' : 'Join Group'}
          </button>
        </header>

        <div className="group-profile-content">
          <div className="about-section">
            <h3>About this group</h3>
            <p>{group.description}</p>
          </div>
          <div className="members-section">
            <h3>Members</h3>
            <div className="members-list">
              {group.members && group.members.length > 0 ? (
                group.members.map((member, index) => (
                  <div key={index} className="member-item">
                    <FaUserCircle />
                    <span>{member.name || member.username || 'Anonymous'}</span>
                  </div>
                ))
              ) : (
                <p>No members yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupProfilePage;