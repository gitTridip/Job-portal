import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, MapPin, Type, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { jobsAPI } from '../api/api';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    employmentType: 'Full Time',
    experienceLevel: '2 Years',
    salaryMin: '',
    salaryMax: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salaryMin' || name === 'salaryMax' ? parseInt(value) || '' : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.location || !formData.salaryMin || !formData.salaryMax || !formData.description) {
      setError('All fields are required');
      return;
    }

    if (formData.salaryMin > formData.salaryMax) {
      setError('Minimum salary cannot be greater than maximum salary');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin * 100000,
        salaryMax: formData.salaryMax * 100000,
      };
      await jobsAPI.create(payload);
      setSuccess('Job posted successfully!');
      setTimeout(() => navigate('/employer-dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-container">
        {/* Header */}
        <div className="post-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to create a job listing</p>
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
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                <Type size={18} /> Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Senior React Developer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <MapPin size={18} /> Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Bangalore"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employmentType">
                <Briefcase size={18} /> Employment Type
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">
                <Briefcase size={18} /> Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="0 Years">Fresher</option>
                <option value="1 Years">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
            </div>
          </div>

          {/* Row 3 - Salary */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">
                <DollarSign size={18} /> Min Salary (in Lakhs)
              </label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                placeholder="5"
                value={formData.salaryMin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax">
                <DollarSign size={18} /> Max Salary (in Lakhs)
              </label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                placeholder="10"
                value={formData.salaryMax}
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
              placeholder="Describe the job role, responsibilities, and requirements..."
              value={formData.description}
              onChange={handleChange}
              rows="8"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/employer-dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Posting Job...
                </>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
