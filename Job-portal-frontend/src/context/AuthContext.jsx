import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Ensure role is normalized to lowercase
    const normalizedUser = {
      ...userData,
      role: userData.role ? userData.role.toLowerCase() : 'candidate'
    };
    setUser(normalizedUser);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getUserRole = () => {
    return user?.role ? user.role.toLowerCase() : null;
  };

  const isJobSeeker = () => {
    const role = getUserRole();
    return role === 'candidate' || role === 'jobseeker';
  };

  const isRecruiter = () => {
    const role = getUserRole();
    return role === 'recruiter' || role === 'employer';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      getUserRole,
      isJobSeeker,
      isRecruiter
    }}>
      {children}
    </AuthContext.Provider>
  );
};
