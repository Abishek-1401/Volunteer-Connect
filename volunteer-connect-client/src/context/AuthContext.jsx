// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Utility to set token for all axios requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: token
        }
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  // Load user data on app start
  const loadUser = useCallback(async () => {
    if (token) {
      setAuthToken(token);
      try {
        const { data } = await axios.get('/api/users/me'); // Fetches user data
        setUser(data);
      } catch (err) {
        console.error("Token is invalid, logging out.", err);
        setAuthToken(null); // Clear bad token
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Register function
  const register = async (userData) => {
    const { data } = await axios.post('/api/users/register', userData);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  // Login function
  const login = async (userData) => {
    const { data } = await axios.post('/api/users/login', userData);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Value to be passed to all components
  const value = {
    token,
    user,
    loading,
    socket,
    register,
    login,
    logout,
  };

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};