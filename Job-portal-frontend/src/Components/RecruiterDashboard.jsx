import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, MapPin, Calendar, Clock, AlertCircle, Loader, BarChart3, Users, Briefcase } from 'lucide-react';
import { driveAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    city: '',
    venue: '',
    driveDate: '',
    reportingTime: '',
    qualificationRequired: '',
    experienceRequired: '',
    contactPerson: '',
    contactEmail: '',
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await driveAPI.getAll();
      if (response.data.message === 'success') {
        // Filter only drives created by current user
        const userDrives = response.data.data.filter(drive => drive.createdBy === user?.id);
        setDrives(userDrives);
      }
    } catch (err) {
      setError('Failed to fetch job drives.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.title || !formData.companyName || !formData.description || 
        !formData.city || !formData.venue || !formData.driveDate || !formData.reportingTime ||
        !formData.qualificationRequired || !formData.experienceRequired ||
        !formData.contactPerson || !formData.contactEmail) {
      setError('All fields are required');
      return;
    }

    try {
      if (editingId) {
        // Update existing drive
        const response = await driveAPI.update(editingId, formData);
        if (response.data.message === 'success') {
          alert('Job drive updated successfully!');
          resetForm();
          setEditingId(null);
          fetchDrives();
        }
      } else {
        // Create new drive
        const response = await driveAPI.create(formData);
        if (response.data.message === 'success') {
          alert('Job drive posted successfully!');
          resetForm();
          fetchDrives();
        }
      }
    } catch (err) {
      setError(err.response?.data?.data || 'Failed to save job drive');
    }
  };

  const handleEdit = (drive) => {
    setFormData({
      title: drive.title,
      companyName: drive.companyName,
      description: drive.description,
      city: drive.city,
      venue: drive.venue,
      driveDate: drive.driveDate,
      reportingTime: drive.reportingTime,
      qualificationRequired: drive.qualificationRequired,
      experienceRequired: drive.experienceRequired,
      contactPerson: drive.contactPerson,
      contactEmail: drive.contactEmail,
    });
    setEditingId(drive.driveId);
    setShowPostForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (driveId) => {
    if (window.confirm('Are you sure you want to delete this job drive?')) {
      try {
        await driveAPI.delete(driveId);
        alert('Job drive deleted successfully!');
        fetchDrives();
      } catch (err) {
        setError(err.response?.data?.data || 'Failed to delete job drive');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      companyName: '',
      description: '',
      city: '',
      venue: '',
      driveDate: '',
      reportingTime: '',
      qualificationRequired: '',
      experienceRequired: '',
      contactPerson: '',
      contactEmail: '',
    });
    setShowPostForm(false);
    setEditingId(null);
  };

  const activeDrives = drives.filter(d => d.status === 'Active');
  const closedDrives = drives.filter(d => d.status === 'Closed');

  return (
    <div className="recruiter-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Manage your job postings and recruitment drives</p>
        </div>
        <button 
          className="btn-primary btn-large"
          onClick={() => setShowPostForm(!showPostForm)}
        >
          <Plus size={20} />
          {showPostForm ? 'Cancel' : 'Post New Job'}
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <BarChart3 size={24} />
          <div>
            <span className="stat-number">{drives.length}</span>
            <span className="stat-label">Total Postings</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} />
          <div>
            <span className="stat-number">{activeDrives.length}</span>
            <span className="stat-label">Active Jobs</span>
          </div>
        </div>
        <div className="stat-card">
          <AlertCircle size={24} />
          <div>
            <span className="stat-number">{closedDrives.length}</span>
            <span className="stat-label">Closed</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          My Postings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Post Job Form */}
      {showPostForm && (
        <div className="post-form-section">
          <h2>{editingId ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
          
          {error && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g., TechCorp Inc."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the job role, responsibilities, and benefits..."
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="venue">Venue *</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., City Convention Center"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="driveDate">Drive Date *</label>
                <input
                  type="date"
                  id="driveDate"
                  name="driveDate"
                  value={formData.driveDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reportingTime">Reporting Time *</label>
                <input
                  type="time"
                  id="reportingTime"
                  name="reportingTime"
                  value={formData.reportingTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="qualificationRequired">Qualification Required *</label>
                <input
                  type="text"
                  id="qualificationRequired"
                  name="qualificationRequired"
                  value={formData.qualificationRequired}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech in CS"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="experienceRequired">Experience Required *</label>
                <input
                  type="text"
                  id="experienceRequired"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleInputChange}
                  placeholder="e.g., 2-5 years"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person *</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="e.g., John HR Manager"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email *</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="e.g., hr@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Job' : 'Post Job'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Postings Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {loading ? (
            <div className="loading-state">
              <Loader size={48} className="spinner" />
              <p>Loading your postings...</p>
            </div>
          ) : drives.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={64} />
              <h3>No Job Postings Yet</h3>
              <p>Start by posting your first job opportunity</p>
              <button 
                className="btn-primary"
                onClick={() => setShowPostForm(true)}
              >
                <Plus size={20} />
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="postings-list">
              {drives.map((drive) => (
                <div key={drive.driveId} className="posting-card">
                  <div className="posting-header">
                    <div>
                      <h3>{drive.title}</h3>
                      <p className="company">{drive.companyName}</p>
                    </div>
                    <span className={`status-badge ${drive.status.toLowerCase()}`}>
                      {drive.status}
                    </span>
                  </div>

                  <p className="posting-description">{drive.description}</p>

                  <div className="posting-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{drive.city} • {drive.venue}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{new Date(drive.driveDate).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{drive.reportingTime}</span>
                    </div>
                  </div>

                  <div className="posting-details">
                    <span>📚 {drive.qualificationRequired}</span>
                    <span>💼 {drive.experienceRequired}</span>
                  </div>

                  <div className="posting-actions">
                    <button className="btn-icon">
                      <Eye size={18} />
                      View
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(drive)}
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button 
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(drive.driveId)}
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <div className="analytics-section">
            <h3>Recruitment Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Total Applications</h4>
                <p className="big-number">--</p>
                <small>Coming soon</small>
              </div>
              <div className="analytics-card">
                <h4>Active Drives</h4>
                <p className="big-number">{activeDrives.length}</p>
              </div>
              <div className="analytics-card">
                <h4>Closed Drives</h4>
                <p className="big-number">{closedDrives.length}</p>
              </div>
              <div className="analytics-card">
                <h4>Conversion Rate</h4>
                <p className="big-number">--</p>
                <small>Coming soon</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
