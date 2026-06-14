import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Type, Calendar, Clock, Mail, Phone, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { driveAPI } from '../api/api';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.title || !formData.companyName || !formData.description || 
        !formData.city || !formData.venue || !formData.driveDate || !formData.reportingTime ||
        !formData.qualificationRequired || !formData.experienceRequired ||
        !formData.contactPerson || !formData.contactEmail) {
      setError('All fields are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      // Send payload matching Drive API structure
      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        description: formData.description,
        city: formData.city,
        venue: formData.venue,
        driveDate: formData.driveDate, // Format: yyyy-MM-dd
        reportingTime: formData.reportingTime, // Format: HH:mm:ss
        qualificationRequired: formData.qualificationRequired,
        experienceRequired: formData.experienceRequired,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
      };
      const response = await driveAPI.create(payload);
      if (response.data.message === 'success') {
        setSuccess('Drive posted successfully!');
        setTimeout(() => navigate('/drives'), 2000);
      } else {
        setError(response.data.data || 'Failed to post drive');
      }
    } catch (err) {
      setError(err.response?.data?.data || err.message || 'Failed to post drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-container">
        {/* Header */}
        <div className="post-header">
          <h1>Create a New Job Drive</h1>
          <p>Fill in the details to create a new recruitment drive</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="post-job-form">
          {/* Row 1 - Drive Title and Company */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                <Type size={18} /> Drive Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Campus Drive 2026"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">
                <Briefcase size={18} /> Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="e.g., Tech Company Inc."
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 - City and Venue */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                <MapPin size={18} /> City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="e.g., Bangalore"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue">
                <MapPin size={18} /> Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                placeholder="e.g., Tech Park, Building A"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 3 - Drive Date and Reporting Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driveDate">
                <Calendar size={18} /> Drive Date
              </label>
              <input
                type="date"
                id="driveDate"
                name="driveDate"
                value={formData.driveDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reportingTime">
                <Clock size={18} /> Reporting Time
              </label>
              <input
                type="time"
                id="reportingTime"
                name="reportingTime"
                value={formData.reportingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 4 - Qualification and Experience */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="qualificationRequired">
                <Type size={18} /> Qualification Required
              </label>
              <input
                type="text"
                id="qualificationRequired"
                name="qualificationRequired"
                placeholder="e.g., B.Tech / BE in CSE"
                value={formData.qualificationRequired}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experienceRequired">
                <Type size={18} /> Experience Required
              </label>
              <input
                type="text"
                id="experienceRequired"
                name="experienceRequired"
                placeholder="e.g., 0-2 years"
                value={formData.experienceRequired}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 5 - Contact Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPerson">
                <Phone size={18} /> Contact Person
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                placeholder="e.g., John Doe"
                value={formData.contactPerson}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">
                <Mail size={18} /> Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                placeholder="e.g., hr@company.com"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label htmlFor="description">
              <Briefcase size={18} /> Job Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the drive, roles, responsibilities, and job requirements..."
              value={formData.description}
              onChange={handleChange}
              rows="8"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/drives')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Creating Drive...
                </>
              ) : (
                'Create Drive'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
