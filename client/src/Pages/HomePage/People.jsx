import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import userPic from '../../assets/pfp2.jpg';

const People = () => {
  const suggestedPeople = [
    { id: 'najid_dev', name: 'Najid', reason: 'Followed by Dims' },
    { id: 'sheila_d', name: 'Sheila Dara', reason: 'Suggested for you' },
  ];

  return (
    <div className="suggestions-card">
      <div className="suggestions-header">
        <h4>Suggested For you</h4>
        <a href="#">See all</a>
      </div>
      <div className="suggestions-list">
        {suggestedPeople.map((person) => (
          <Link to={`/profile/${person.id}`} key={person.id} className="list-item-link">
            <div className="suggestion-item">
              <img src={userPic} alt={person.name} />
              <div className="suggestion-info">
                <strong>{person.name}</strong>
                <p>{person.reason}</p>
              </div>
              <button className="suggestion-follow-btn">Follow</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default People;