import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = () => {
  const { token } = useAuth();

  // If a token exists, render the child route (using Outlet).
  // Otherwise, redirect to the login page.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;