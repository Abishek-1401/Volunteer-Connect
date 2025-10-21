import React from 'react';
import './ProfileAbout.css';

const ProfileAbout = () => {
    const user = {
        bio: 'Passionate MERN stack developer creating impactful web applications. Dedicated to leveraging technology for social good and community building.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'CSS', 'Community Organizing']
    };

    return (
        <div className="profile-about-card">
            <h3 className="about-title">About</h3>
            <p className="about-bio">{user.bio}</p>

            <h3 className="about-title">Skills</h3>
            <div className="about-skills">
                {user.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                ))}
            </div>
        </div>
    );
};

export default ProfileAbout;