import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import the context from the new file

// A utility to set the auth token for all future axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setAuthToken(null);
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      setAuthToken(tokenFromStorage);
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const register = useCallback(async (userData) => {
    const res = await axios.post('/api/users/register', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setAuthToken(res.data.token);
    await loadUser();
  }, [loadUser]);

  const login = useCallback(async (userData) => {
    const res = await axios.post('/api/users/login', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setAuthToken(res.data.token);
    await loadUser();
  }, [loadUser]);

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};