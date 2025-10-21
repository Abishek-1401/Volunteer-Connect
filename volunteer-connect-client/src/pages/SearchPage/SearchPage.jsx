import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Post from '../../components/Post/Post';
import UserCard from '../../components/UserCard/UserCard';
import GroupCard from '../../components/GroupCard/GroupCard';
import './SearchPage.css';

// --- Mock Data (Replace with API calls later) ---
const allPosts = [
    { id: 1, author: 'Jane Doe', content: 'Excited to start a new community garden project this weekend! #gardening', likes: 12, comments: 4 },
    { id: 2, author: 'John Smith', content: 'Our team successfully distributed 100+ care packages. Feeling grateful!', likes: 45, comments: 12 },
];
const allPeople = [
    { id: 1, name: 'Eleanor Pena', title: 'Community Organizer' },
    { id: 2, name: 'Cody Fisher', title: 'NGO Founder' },
];
const allGroups = [
    { id: 1, name: 'Local Food Bank', description: 'Fighting Hunger Together' },
    { id: 2, name: 'Beach Cleanup Crew', description: 'Ocean Preservation Activists' },
];

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({ posts: [], people: [], groups: [] });

  useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredPosts = allPosts.filter(post => post.content.toLowerCase().includes(lowerCaseQuery));
      const filteredPeople = allPeople.filter(user => user.name.toLowerCase().includes(lowerCaseQuery));
      const filteredGroups = allGroups.filter(group => group.name.toLowerCase().includes(lowerCaseQuery));
      setResults({ posts: filteredPosts, people: filteredPeople, groups: filteredGroups });
    } else {
      setResults({ posts: [], people: [], groups: [] });
    }
  }, [query]);

  const renderResults = () => {
    switch (activeTab) {
      case 'people':
        return results.people.length > 0 ? results.people.map(user => <UserCard key={user.id} user={user} />) : <p>No people found.</p>;
      case 'groups':
        return results.groups.length > 0 ? results.groups.map(group => <GroupCard key={group.id} group={group} />) : <p>No groups found.</p>;
      case 'posts':
      default:
        return results.posts.length > 0 ? results.posts.map(postData => <Post key={postData.id} post={postData} />) : <p>No posts found for "{query}".</p>;
    }
  };

  return (
    <div className="search-page">
      <Navbar />
      <main className="search-container">
        <h1 className="search-title">Results for "{query}"</h1>
        <div className="search-tabs">
          <button className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
          <button className={`tab-button ${activeTab === 'people' ? 'active' : ''}`} onClick={() => setActiveTab('people')}>People</button>
          <button className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => setActiveTab('groups')}>Groups</button>
        </div>
        <div className="search-results">
          {renderResults()}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;