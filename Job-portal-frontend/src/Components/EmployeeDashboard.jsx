import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, CheckCircle, XCircle, Briefcase, Loader, AlertCircle } from 'lucide-react';
import { dashboardAPI, applicationsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        dashboardAPI.getEmployeeDashboard(),
        applicationsAPI.getMyApplications(),
      ]);

      setStats(statsRes.data);
      setApplications(appsRes.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader size={40} className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="employee-dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {user?.fullName}! 👋</h1>
            <p>Here's your job search overview</p>
          </div>
          <button
            className="btn-browse-jobs"
            onClick={() => navigate('/jobs')}
          >
            <Briefcase size={20} />
            Browse Jobs
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <BarChart3 size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Applications</p>
              <h2 className="stat-value">{stats?.totalApplications || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon applied">
              <Briefcase size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Applied</p>
              <h2 className="stat-value">{stats?.applied || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon shortlisted">
              <CheckCircle size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Shortlisted</p>
              <h2 className="stat-value">{stats?.shortlisted || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rejected">
              <XCircle size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Rejected</p>
              <h2 className="stat-value">{stats?.rejected || 0}</h2>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="applications-section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <button
              className="btn-view-all"
              onClick={() => navigate('/my-applications')}
            >
              View All
            </button>
          </div>

          {applications.length > 0 ? (
            <div className="applications-list">
              {applications.slice(0, 5).map((app) => (
                <div key={app.applicationId} className="application-item">
                  <div className="app-info">
                    <h4>{app.jobTitle}</h4>
                    <p>{app.companyName}</p>
                  </div>
                  <div className={`app-status status-${app.status.toLowerCase()}`}>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Briefcase size={40} />
              <h3>No applications yet</h3>
              <p>Start exploring jobs to apply</p>
              <button
                className="btn-explore"
                onClick={() => navigate('/jobs')}
              >
                Explore Jobs
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card">
            <h3>Complete Your Profile</h3>
            <p>Add more details to increase your chances of getting hired</p>
            <button
              className="btn-action"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </button>
          </div>

          <div className="action-card">
            <h3>Upload Resume</h3>
            <p>Help employers get to know you better with your resume</p>
            <button
              className="btn-action"
              onClick={() => navigate('/profile')}
            >
              Upload Resume
            </button>
          </div>

          <div className="action-card">
            <h3>Browse More Jobs</h3>
            <p>Discover new opportunities that match your skills</p>
            <button
              className="btn-action"
              onClick={() => navigate('/jobs')}
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
