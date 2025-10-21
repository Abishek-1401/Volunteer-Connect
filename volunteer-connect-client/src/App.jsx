import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import SignupPage from './pages/SignupPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SearchPage from './pages/SearchPage/SearchPage';
import MessengerPage from './pages/MessengerPage/MessengerPage'; 
import ProjectHubPage from './pages/ProjectHubPage/ProjectHubPage';
import DetailedProjectPage from './pages/DetailedProjectPage/DetailedProjectPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage/ProjectDashboardPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import GroupProfilePage from './pages/GroupProfilePage/GroupProfilePage';
import CreateGroupPage from './pages/CreateGroupPage/CreateGroupPage';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* --- Public-Only Routes --- */}
      {/* Users who are logged in will be redirected from these pages */}
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
      </Route>

      {/* --- Private Routes --- */}
      {/* Users who are NOT logged in will be redirected from these pages */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/messenger" element={<MessengerPage />} />
        <Route path="/projects" element={<ProjectHubPage />} />
        <Route path="/projects/create" element={<CreateProjectPage />} />
        <Route path="/projects/:projectId" element={<DetailedProjectPage />} />
        <Route path="/projects/:projectId/dashboard" element={<ProjectDashboardPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/create" element={<CreateGroupPage />} />
        <Route path="/groups/:groupId" element={<GroupProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;