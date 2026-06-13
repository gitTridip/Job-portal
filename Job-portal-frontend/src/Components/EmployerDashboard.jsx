import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Briefcase, CheckCircle, Loader, AlertCircle, Plus } from 'lucide-react';
import { dashboardAPI, jobsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        dashboardAPI.getEmployerDashboard(),
        jobsAPI.getMyJobs(),
      ]);

      setStats(statsRes.data);
      setJobs(jobsRes.data || []);
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
    <div className="employer-dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome to Your Hiring Dashboard! 🏢</h1>
            <p>Manage your job postings and applicants</p>
          </div>
          <button
            className="btn-post-job"
            onClick={() => navigate('/post-job')}
          >
            <Plus size={20} />
            Post New Job
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
            <div className="stat-icon jobs">
              <Briefcase size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Active Jobs</p>
              <h2 className="stat-value">{stats?.totalJobs || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon applicants">
              <Users size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Applicants</p>
              <h2 className="stat-value">{stats?.totalApplicants || 0}</h2>
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
            <div className="stat-icon overview">
              <BarChart3 size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Rejected</p>
              <h2 className="stat-value">{stats?.rejected || 0}</h2>
            </div>
          </div>
        </div>

        {/* My Jobs Section */}
        <div className="jobs-section">
          <div className="section-header">
            <h2>Your Job Postings</h2>
            <button
              className="btn-view-all"
              onClick={() => navigate('/my-jobs')}
            >
              View All
            </button>
          </div>

          {jobs.length > 0 ? (
            <div className="jobs-list">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.jobId} className="job-item">
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <p>{job.location}</p>
                  </div>
                  <div className="job-applicants">
                    <Users size={16} />
                    <span>{job.applicantCount || 0} applicants</span>
                  </div>
                  <button
                    className="btn-view-applicants"
                    onClick={() => navigate(`/job-applicants/${job.jobId}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Briefcase size={40} />
              <h3>No job postings yet</h3>
              <p>Create your first job posting to start hiring</p>
              <button
                className="btn-post-first"
                onClick={() => navigate('/post-job')}
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card">
            <h3>Post a New Job</h3>
            <p>Create a job listing to attract top talent</p>
            <button
              className="btn-action"
              onClick={() => navigate('/post-job')}
            >
              Post Job
            </button>
          </div>

          <div className="action-card">
            <h3>View All Applicants</h3>
            <p>Review applications from candidates</p>
            <button
              className="btn-action"
              onClick={() => navigate('/my-jobs')}
            >
              Manage Applications
            </button>
          </div>

          <div className="action-card">
            <h3>Update Company Info</h3>
            <p>Keep your company profile up to date</p>
            <button
              className="btn-action"
              onClick={() => navigate('/employer-profile')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
