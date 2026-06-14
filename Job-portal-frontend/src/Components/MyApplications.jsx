import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Loader, AlertCircle, Search } from 'lucide-react';
import { applicationsAPI } from '../api/api';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data || []);
      setFilteredApplications(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [filter, applications]);

  const applyFilter = () => {
    if (filter === 'All') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter((app) => app.status === filter)
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'status-applied';
      case 'Shortlisted':
        return 'status-shortlisted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-applied';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader size={40} className="spinner" />
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="applications-container">
        {/* Header */}
        <div className="applications-header">
          <h1>My Applications</h1>
          <p>Track the status of all your job applications</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="filter-tabs">
          {['All', 'Applied', 'Shortlisted', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
              {status !== 'All' && (
                <span className="tab-count">
                  (
                  {applications.filter((app) => app.status === status).length}
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="applications-grid">
            {filteredApplications.map((app) => (
              <div key={app.applicationId} className="application-card">
                <div className="card-header">
                  <h3>{app.jobTitle}</h3>
                  <div className={`status-badge ${getStatusColor(app.status)}`}>
                    {app.status}
                  </div>
                </div>

                <p className="company-name">{app.companyName}</p>

                <div className="card-meta">
                  <span className="meta-item">
                    <Briefcase size={14} />
                    {app.jobTitle}
                  </span>
                </div>

                {app.appliedDate && (
                  <div className="applied-date">
                    <Calendar size={14} />
                    Applied on{' '}
                    {new Date(app.appliedDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                )}

                <div className="card-actions">
                  <button className="btn-view">View Details</button>
                  {app.status === 'Shortlisted' && (
                    <button className="btn-prepare">Prepare for Interview</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <Search size={40} />
            <h3>No applications found</h3>
            <p>
              {filter === 'All'
                ? 'You haven\'t applied for any jobs yet'
                : `You don't have any ${filter.toLowerCase()} applications`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
