import React, { createContext, useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
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

  // 2. Wrap logout in useCallback
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

  // 3. Wrap loadUser in useCallback and add its dependency (logout)
  const loadUser = useCallback(async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('http://localhost:5001/api/auth/user');
      setAuthState(prevState => ({
        ...prevState,
        isAuthenticated: true,
        loading: false,
        user: res.data,
      }));
    } catch (err) {
      logout();
    }
  }, [logout]);

  // Run loadUser once when the app loads
  useEffect(() => {
    loadUser();
  }, [loadUser]); // 4. Add loadUser as a dependency

  const register = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', formData, config);
      localStorage.setItem('token', res.data.token);
      await loadUser();
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
      const res = await axios.post('${process.env.REACT_APP_API_URL}/api/auth/register', formData, config);
      localStorage.setItem('token', res.data.token);
      await loadUser();
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