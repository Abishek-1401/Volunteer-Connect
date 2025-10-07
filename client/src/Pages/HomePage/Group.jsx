import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import groupIcon from '../../assets/pfp3.jpg';

const Group = () => {
  const suggestedGroups = [
    { id: 'react_devs', name: 'React Developers', members: '12k Members' },
    { id: 'ui_designers', name: 'UX/UI Designers', members: '8k Members' },
  ];

  return (
    <div className="suggestions-card">
      <div className="suggestions-header">
        <h4>Groups you might like</h4>
        <a href="#">See all</a>
      </div>
      <div className="suggestions-list">
        {suggestedGroups.map((group) => (
          <Link to={`/group/${group.id}`} key={group.id} className="list-item-link">
            <div className="suggestion-item">
              <img src={groupIcon} alt={group.name} style={{ borderRadius: '8px' }}/>
              <div className="suggestion-info">
                <strong>{group.name}</strong>
                <p>{group.members}</p>
              </div>
              <button className="suggestion-follow-btn">Join</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Group;