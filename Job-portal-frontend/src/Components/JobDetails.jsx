import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Loader, AlertCircle, Share2 } from 'lucide-react';
import { jobsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addApplicationForUser, getApplicationByUserAndDrive } from '../utils/localStorage';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false);
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

  const getDriveId = (jobData) => jobData?.driveId || jobData?.id || id;

  useEffect(() => {
    if (user?.id && job) {
      const driveId = getDriveId(job);
      setApplied(Boolean(getApplicationByUserAndDrive(user.id, driveId)));
    }
  }, [user, job, id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const role = user?.role?.toLowerCase();
    if (role !== 'candidate' && role !== 'jobseeker' && role !== 'employee') {
      setError('Only job seekers can apply for jobs');
      return;
    }

    setConfirmApplyOpen(true);
  };

  const confirmApply = () => {
    if (!user?.id || !job) return;

    const application = addApplicationForUser(user.id, job);
    if (!application) {
      showToast('You have already applied to this job.', 'info');
    } else {
      setApplied(true);
      showToast('Application saved successfully!', 'success');
    }
    setConfirmApplyOpen(false);
  };

  const cancelApply = () => {
    setConfirmApplyOpen(false);
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
                    disabled={applying || applied}
                  >
                    {applied ? 'Applied' : applying ? (
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
      {confirmApplyOpen && job && (
        <div className="apply-modal-overlay">
          <div className="apply-modal-card">
            <div className="modal-header">
              <h3>Confirm Application</h3>
              <button className="modal-close" onClick={cancelApply}>&times;</button>
            </div>
            <p>Are you sure you want to apply for "{job.title}" at {job.companyName}?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={cancelApply}>Cancel</button>
              <button className="btn-primary" onClick={confirmApply}>Yes, Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
