import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
    logout();
    navigate('/');
    setIsMobileOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">JobHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu-desktop">
          <Link to="/drives" className="nav-link">
            Job Drives
          </Link>
          
          {!isAuthenticated ? (
            <div className="nav-actions">
              <button 
                className="btn-secondary"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="btn-primary"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.Name || 'User'}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="nav-menu-mobile">
          <Link 
            to="/drives" 
            className="mobile-nav-link"
            onClick={() => handleNavClick('/drives')}
          >
            Job Drives
          </Link>
          
          {!isAuthenticated ? (
            <div className="mobile-nav-actions">
              <button 
                className="btn-secondary-mobile"
                onClick={() => handleNavClick('/login')}
              >
                Login
              </button>
              <button 
                className="btn-primary-mobile"
                onClick={() => handleNavClick('/register')}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="mobile-user-menu">
              <div className="mobile-user-info">
                <strong>Welcome, {user?.Name || 'User'}</strong>
              </div>
              <button 
                className="logout-btn-mobile" 
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
