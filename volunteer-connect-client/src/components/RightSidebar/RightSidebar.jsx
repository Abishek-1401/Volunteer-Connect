import React, { useState, useEffect } from 'react';
import './RightSidebar.css';
import { FaUsers } from 'react-icons/fa';

// This is the card for a single person suggestion
const PersonCard = ({ person }) => {
  return (
    <div className="suggestion-card">
      <img src={person.picture.thumbnail} alt={`${person.name.first} ${person.name.last}`} className="suggestion-avatar" />
      <div className="suggestion-info">
        <span className="suggestion-name">{`${person.name.first} ${person.name.last}`}</span>
        <span className="suggestion-desc">{person.location.city}, {person.location.country}</span>
      </div>
      <button className="suggestion-button">Follow</button>
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

  // Mock data for groups
  const groupSuggestions = [
    { id: 1, name: 'Local Food Bank', description: 'Fighting Hunger' },
    { id: 2, name: 'Animal Shelter Volunteers', description: 'Animal Welfare' },
  ];

  // Fetch people suggestions when the component mounts
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=4') // Fetch 4 random users
      .then(res => res.json())
      .then(data => {
        setPeople(data.results);
        setLoading(false);
      })
      .catch(error => {
          console.error("Failed to fetch user suggestions:", error);
          setLoading(false);
      });
  }, []);

  return (
    <aside className="right-sidebar">
      <div className="suggestion-box">
        <h4 className="suggestion-title">People you may know</h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          people.map(person => <PersonCard key={person.login.uuid} person={person} />)
        )}
      </div>
      <div className="suggestion-box">
        <h4 className="suggestion-title">Groups you might like</h4>
        {groupSuggestions.map(group => <GroupCard key={group.id} group={group} />)}
      </div>
    </aside>
  );
};

export default RightSidebar;