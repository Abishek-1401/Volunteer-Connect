import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './GroupProfilePage.css';
import { FaUsers, FaUserCircle } from 'react-icons/fa';

// Mock data for groups (you would fetch this from a single source in a real app)
const mockGroups = [
  { id: '1', name: 'Beach Cleanup Crew', members: 45, description: 'Cleaning up our shores, one beach at a time. We organize weekly cleanups and advocate for environmental awareness.', membersList: [{name: 'You'}, {name: 'Jane Doe'}] },
  { id: '2', name: 'Local Food Bank Volunteers', members: 128, description: 'Fighting Hunger Together in our community. Join us to help sort, pack, and distribute food to those in need.', membersList: [{name: 'You'}, {name: 'John Smith'}] },
  { id: '3', name: 'Tech Mentors for Kids', members: 22, description: 'Teaching the next generation of innovators. We host free coding workshops for local students.', membersList: [{name: 'You'}, {name: 'Cody Fisher'}] },
];

const GroupProfilePage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    // Simulate fetching the specific group's data
    const foundGroup = mockGroups.find(g => g.id === groupId);
    setGroup(foundGroup);
  }, [groupId]);

  if (!group) {
    return <div>Loading...</div>; // Or a proper loading component
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
          <p>{group.members} members</p>
          <button className="group-profile-join-btn">Join Group</button>
        </header>

        <div className="group-profile-content">
          <div className="about-section">
            <h3>About this group</h3>
            <p>{group.description}</p>
          </div>
          <div className="members-section">
            <h3>Members</h3>
            <div className="members-list">
              {group.membersList.map((member, index) => (
                <div key={index} className="member-item">
                  <FaUserCircle />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupProfilePage;