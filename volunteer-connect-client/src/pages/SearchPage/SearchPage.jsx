  import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Post from '../../components/Post/Post';
import UserCard from '../../components/UserCard/UserCard';
import GroupCard from '../../components/GroupCard/GroupCard';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './SearchPage.css';

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState({ posts: [], people: [], groups: [], projects: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults({ posts: [], people: [], groups: [], projects: [] });
        return;
      }

      setLoading(true);
      try {
        const [postsRes, usersRes, groupsRes, projectsRes] = await Promise.all([
          fetch(`/api/posts/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/users/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/groups/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/projects/search?q=${encodeURIComponent(query)}`)
        ]);

        const posts = postsRes.ok ? await postsRes.json() : [];
        const people = usersRes.ok ? await usersRes.json() : [];
        const groups = groupsRes.ok ? await groupsRes.json() : [];
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        setResults({ posts, people, groups, projects });
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults({ posts: [], people: [], groups: [], projects: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const renderResults = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    switch (activeTab) {
      case 'people':
        return results.people.length > 0 ? results.people.map(user => <UserCard key={user._id} user={user} />) : <p>No people found.</p>;
      case 'groups':
        return results.groups.length > 0 ? results.groups.map(group => <GroupCard key={group._id} group={group} />) : <p>No groups found.</p>;
      case 'projects':
        return results.projects.length > 0 ? results.projects.map(project => <ProjectCard key={project._id} project={project} />) : <p>No projects found.</p>;
      case 'posts':
      default:
        return results.posts.length > 0 ? results.posts.map(postData => <Post key={postData._id} post={postData} />) : <p>No posts found for "{query}".</p>;
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
          <button className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        </div>
        <div className="search-results">
          {renderResults()}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;