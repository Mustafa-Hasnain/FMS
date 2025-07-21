import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from '../utils/jwtUtil';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({sub: 'admin@gmail.com', Name: 'Admin'});
  const [loading, setLoading] = useState(true);

  console.log("User: ", user);

  // Load user from token on first load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem('token'); // invalid token
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getUserDetails = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return decodeToken(token);
  };

  const updateUserDetails = (newDetails) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = decodeToken(token);
    const updated = { ...decoded, ...newDetails };

    // This part assumes you're not validating the JWT signature again.
    // Only works safely for local updates (e.g., UI-based info)
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      getUserDetails,
      updateUserDetails,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
