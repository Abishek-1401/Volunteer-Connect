import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RightSidebar.css';
import { FaUsers } from 'react-icons/fa';

// This is the card for a single person suggestion
const PersonCard = ({ user, onFollow }) => {
  const handleFollow = () => {
    onFollow(user._id);
  };

  return (
    <div className="suggestion-card">
      <img src={user.profileImage || '/assets/default-avatar.png'} alt={user.name} className="suggestion-avatar" />
      <div className="suggestion-info">
        <span className="suggestion-name">{user.name}</span>
        <span className="suggestion-desc">@{user.username}</span>
      </div>
      <button className="suggestion-button" onClick={handleFollow}>Follow</button>
    </div>
  );
};

// This is the card for a single group suggestion (still using mock data)
const GroupCard = ({ group }) => {
    return (
      <div className="suggestion-card">
        <FaUsers className="suggestion-icon" />
        <div className="suggestion-info">
          <span className="suggestion-name">{group.name}</span>
          <span className="suggestion-desc">{group.description}</span>
        </div>
        <button className="suggestion-button">Join</button>
      </div>
    );
  };

const RightSidebar = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const handleFollow = async (userId) => {
    try {
      await axios.put(`/api/users/${userId}/follow`);
      // Remove the followed user from suggestions
      setPeople(prev => prev.filter(p => p._id !== userId));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  // Fetch people suggestions when the component mounts
  useEffect(() => {
    const fetchUserSuggestions = async () => {
      try {
        const response = await axios.get('/api/users/suggestions');
        setPeople(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user suggestions:", error);
        setLoading(false);
      }
    };

    fetchUserSuggestions();
  }, []);

  // Fetch group suggestions
  useEffect(() => {
    const fetchGroupSuggestions = async () => {
      try {
        const response = await axios.get('/api/groups/suggestions');
        setGroupSuggestions(response.data);
      } catch (error) {
        console.error('Failed to fetch group suggestions:', error);
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroupSuggestions();
  }, []);

  return (
    <aside className="right-sidebar">
      <div className="suggestion-box">
        <h4 className="suggestion-title">People you may know</h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          people.map(user => <PersonCard key={user._id} user={user} onFollow={handleFollow} />)
        )}
      </div>
      <div className="suggestion-box">
        <h4 className="suggestion-title">Groups you might like</h4>
        {groupsLoading ? (
          <p>Loading...</p>
        ) : (
          groupSuggestions.map(group => <GroupCard key={group._id} group={group} />)
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;