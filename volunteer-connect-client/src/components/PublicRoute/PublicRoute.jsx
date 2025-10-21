import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PublicRoute = () => {
  const { token } = useAuth();

  // If a token exists (user is logged in), redirect to the home page.
  // Otherwise, render the child route (e.g., the Login or Signup page).
  return token ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoute;