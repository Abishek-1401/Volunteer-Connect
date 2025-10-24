// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import SignupPage from './pages/SignupPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import SearchPage from './pages/SearchPage/SearchPage';
import MessengerPage from './pages/MessengerPage/MessengerPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import GroupProfilePage from './pages/GroupProfilePage/GroupProfilePage';
import CreateGroupPage from './pages/CreateGroupPage/CreateGroupPage';
import ProjectHubPage from './pages/ProjectHubPage/ProjectHubPage';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage/ProjectDashboardPage';
import DetailedProjectPage from './pages/DetailedProjectPage/DetailedProjectPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/messenger" element={<MessengerPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupProfilePage />} />
        <Route path="/groups/create" element={<CreateGroupPage />} />
        <Route path="/projects" element={<ProjectHubPage />} />
        <Route path="/projects/create" element={<CreateProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDashboardPage />} />
        <Route path="/projects/:id/details" element={<DetailedProjectPage />} />
      </Route>
    </Routes>
  );
}

export default App;
