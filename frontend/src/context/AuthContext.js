import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuthState({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    try {
      const res = await axios.get('http://localhost:5001/api/auth/user');
      
      // --- THE FIX IS HERE ---
      // This now correctly updates the token in the state along with the user info.
      setAuthState({
        token: token, // Add the token from localStorage to the state
        isAuthenticated: true,
        loading: false,
        user: res.data,
      });

    } catch (err) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', formData, config);
      localStorage.setItem('token', res.data.token);
      await loadUser(); // This will now correctly update the state
      return { success: true };
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        logout();
        return { success: false, msg: err.response.data.msg };
      } else {
        console.error('Error:', err.message);
        logout();
        return { success: false, msg: 'Cannot connect to the server.' };
      }
    }
  };

  const login = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData, config);
      localStorage.setItem('token', res.data.token);
      await loadUser(); // This will now correctly update the state
      return { success: true };
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        logout();
        return { success: false, msg: err.response.data.msg };
      } else {
        console.error('Error:', err.message);
        logout();
        return { success: false, msg: 'Cannot connect to the server.' };
      }
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};