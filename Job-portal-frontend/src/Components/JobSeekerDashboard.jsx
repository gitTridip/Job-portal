import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Briefcase, Users, Heart, Share2, AlertCircle, Loader } from 'lucide-react';
import { driveAPI, applicationsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [drives, setDrives] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchDrives();
    } else if (activeTab === 'applications') {
      fetchMyApplications();
    }
  }, [activeTab]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await driveAPI.getAll();
      if (response.data.message === 'success') {
        setDrives(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await applicationsAPI.getMyApplications();
      if (response.data.message === 'success') {
        setMyApplications(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch applications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      const response = await applicationsAPI.applyForDrive(driveId);
      if (response.data.message === 'success') {
        alert('Application submitted successfully!');
        fetchDrives();
      }
    } catch (err) {
      alert(err.response?.data?.data || 'Failed to submit application');
    }
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || drive.city.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="job-seeker-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Discover amazing opportunities tailored for you</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Briefcase size={24} />
            <div>
              <span className="stat-number">{drives.length}</span>
              <span className="stat-label">Active Jobs</span>
            </div>
          </div>
          <div className="stat-card">
            <Users size={24} />
            <div>
              <span className="stat-number">{myApplications.length}</span>
              <span className="stat-label">Applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Jobs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>

      {/* Browse Jobs Tab */}
      {activeTab === 'browse' && (
        <div className="tab-content">
          {/* Search and Filters */}
          <div className="search-section">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by job title, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Filter by location..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <Loader size={48} className="spinner" />
              <p>Loading opportunities...</p>
            </div>
          ) : filteredDrives.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={64} />
              <h3>No Jobs Found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredDrives.map((drive) => (
                <div key={drive.driveId} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{drive.title}</h3>
                      <p className="company-name">{drive.companyName}</p>
                    </div>
                    <span className={`status-badge ${drive.status.toLowerCase()}`}>
                      {drive.status}
                    </span>
                  </div>

                  <p className="job-description">{drive.description}</p>

                  <div className="job-details">
                    <div className="detail">
                      <MapPin size={16} />
                      <span>{drive.city} • {drive.venue}</span>
                    </div>
                    <div className="detail">
                      <Calendar size={16} />
                      <span>{new Date(drive.driveDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail">
                      <Clock size={16} />
                      <span>{drive.reportingTime}</span>
                    </div>
                  </div>

                  <div className="job-requirements">
                    <div className="requirement">
                      <strong>Qualification:</strong>
                      <span>{drive.qualificationRequired}</span>
                    </div>
                    <div className="requirement">
                      <strong>Experience:</strong>
                      <span>{drive.experienceRequired}</span>
                    </div>
                  </div>

                  <div className="job-actions">
                    <button 
                      className="btn-view-details"
                      onClick={() => navigate(`/drive/${drive.driveId}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-apply"
                      onClick={() => handleApply(drive.driveId)}
                    >
                      Apply Now
                    </button>
                  </div>

                  <div className="job-footer">
                    <button className="icon-btn">
                      <Heart size={18} />
                    </button>
                    <button className="icon-btn">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="tab-content">
          {loading ? (
            <div className="loading-state">
              <Loader size={48} className="spinner" />
              <p>Loading your applications...</p>
            </div>
          ) : myApplications.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={64} />
              <h3>No Applications Yet</h3>
              <p>Start applying to jobs to see them here</p>
              <button 
                className="btn-primary"
                onClick={() => setActiveTab('browse')}
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="applications-list">
              {myApplications.map((app) => (
                <div key={app.id} className="application-item">
                  <div className="app-header">
                    <div>
                      <h4>{app.jobTitle || 'Job Title'}</h4>
                      <p className="company">{app.companyName}</p>
                    </div>
                    <span className={`app-status ${app.status?.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="app-date">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="tab-content">
          <div className="profile-section">
            <h3>My Profile</h3>
            <div className="profile-info">
              <div className="info-item">
                <label>Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Mobile</label>
                <p>{user?.mobile || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p>{user?.role}</p>
              </div>
            </div>
            <button className="btn-secondary">Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;
