import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Loader, AlertCircle, Share2 } from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getById(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'Employee') {
      setError('Only job seekers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await applicationsAPI.create({ jobId: id });
      setApplied(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader size={40} className="spinner" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="error-container">
        <AlertCircle size={40} />
        <h2>{error}</h2>
        <button onClick={() => navigate('/jobs')} className="btn-back">
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error-container">
        <AlertCircle size={40} />
        <h2>Job not found</h2>
        <button onClick={() => navigate('/jobs')} className="btn-back">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">
        {/* Header */}
        <div className="job-header">
          <div className="job-header-content">
            <h1>{job.title}</h1>
            <p className="company-name">{job.companyName}</p>
            <div className="job-meta">
              <span><MapPin size={16} /> {job.location}</span>
              <span><Briefcase size={16} /> {job.employmentType}</span>
              <span><Clock size={16} /> {job.experienceLevel}</span>
            </div>
          </div>
          <button className="btn-share">
            <Share2 size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="job-content-grid">
          {/* Left Column */}
          <div className="job-main">
            {/* Salary Section */}
            <div className="info-card">
              <div className="info-header">
                <DollarSign size={24} />
                <h3>Salary</h3>
              </div>
              <p className="salary-range">
                ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L per year
              </p>
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>Job Description</h2>
              <div className="description-content">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="requirements-section">
              <h2>Requirements</h2>
              <ul>
                <li>Experience: {job.experienceLevel}</li>
                <li>Employment Type: {job.employmentType}</li>
                <li>Salary Range: ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="job-sidebar">
            <div className="apply-card">
              {error && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {applied ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Application Submitted!</h3>
                  <p>We'll notify you about your application status soon.</p>
                  <button onClick={() => navigate('/my-applications')} className="btn-view-apps">
                    View My Applications
                  </button>
                </div>
              ) : (
                <>
                  <h3>Interested in this job?</h3>
                  <p>Apply now and let's get started!</p>
                  <button
                    onClick={handleApply}
                    className="btn-apply"
                    disabled={applying}
                  >
                    {applying ? (
                      <>
                        <Loader size={18} className="spinner" />
                        Applying...
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                  {!isAuthenticated && (
                    <p className="login-hint">
                      <button onClick={() => navigate('/login')} className="link-btn">
                        Sign in
                      </button>
                      {' '}to apply for this job
                    </p>
                  )}
                </>
              )}

              <div className="job-info-box">
                <div className="info-item">
                  <span className="label">Location</span>
                  <span className="value">{job.location}</span>
                </div>
                <div className="info-item">
                  <span className="label">Job Type</span>
                  <span className="value">{job.employmentType}</span>
                </div>
                <div className="info-item">
                  <span className="label">Experience</span>
                  <span className="value">{job.experienceLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
