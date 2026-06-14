import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
              <div className="dropdown">
                <button 
                  className="dropdown-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{user?.fullName}</span>
                  <ChevronDown size={18} />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {user?.role === 'Employee' ? (
                      <>
                        <Link to="/employee-dashboard" onClick={() => setIsDropdownOpen(false)}>
                          Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                          Profile
                        </Link>
                        <Link to="/my-applications" onClick={() => setIsDropdownOpen(false)}>
                          My Applications
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/employer-dashboard" onClick={() => setIsDropdownOpen(false)}>
                          Dashboard
                        </Link>
                        <Link to="/employer-profile" onClick={() => setIsDropdownOpen(false)}>
                          Company Profile
                        </Link>
                        <Link to="/my-jobs" onClick={() => setIsDropdownOpen(false)}>
                          My Jobs
                        </Link>
                      </>
                    )}
                    <hr />
                    <button className="logout-btn" onClick={handleLogout}>
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
              <div className="mobile-menu-item">
                <strong>{user?.fullName}</strong>
              </div>
              <div className="mobile-menu-item">
                <strong>Role:</strong> {user?.role}
              </div>
              {user?.role === 'Employee' ? (
                <>
                  <Link to="/employee-dashboard" onClick={() => handleNavClick('/employee-dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => handleNavClick('/profile')}>
                    Profile
                  </Link>
                  <Link to="/my-applications" onClick={() => handleNavClick('/my-applications')}>
                    My Applications
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/employer-dashboard" onClick={() => handleNavClick('/employer-dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/employer-profile" onClick={() => handleNavClick('/employer-profile')}>
                    Company Profile
                  </Link>
                  <Link to="/my-jobs" onClick={() => handleNavClick('/my-jobs')}>
                    My Jobs
                  </Link>
                </>
              )}
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
