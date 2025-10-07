import React from 'react';
import HomeNavbar from '../../components/HomeNavbar';
import ProfileCard from './ProfileCard';
import Feeds from './Feeds'; // Assuming you have a Feeds component
import People from './People'; // Import the People component
import Group from './Group';   // Import the Group component
import './HomePage.css';
import profilePic from '../../assets/profile.jpg';

const HomePage = () => {
  const currentUser = {
    name: 'Abishek',
    handle: 'Abishek-1401',
    profileImage: profilePic,
    stats: {
      followers: '1.2k',
      following: 340,
    },
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    bio: 'Passionate MERN stack developer creating impactful web applications.',
  };

  return (
    <div className="home-page">
      <HomeNavbar />
      <main className="home-container">
        <aside className="left-column">
          <ProfileCard user={currentUser} />
        </aside>
        <section className="middle-column">
          <Feeds />
        </section>
        <aside className="right-column">
          <People />
          <Group />
        </aside>
      </main>
    </div>
  );
};

export default HomePage;