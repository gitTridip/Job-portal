import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Search, Loader, AlertCircle, ArrowRight } from 'lucide-react';
import { jobsAPI } from '../api/api';
import './JobListing.css';

const JobListing = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    employmentType: '',
    experience: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll();
      setJobs(response.data || []);
      setFilteredJobs(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.employmentType) {
      filtered = filtered.filter((job) => job.employmentType === filters.employmentType);
    }

    if (filters.experience) {
      filtered = filtered.filter((job) => job.experienceLevel === filters.experience);
    }

    setFilteredJobs(filtered);
  };

  const resetFilters = () => {
    setFilters({ location: '', employmentType: '', experience: '' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader size={40} className="spinner" />
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="job-listing-page">
      <div className="job-listing-container">
        {/* Header */}
        <div className="listing-header">
          <h1>Explore Opportunities</h1>
          <p>Browse through thousands of job openings</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-card">
            <h3>Filter Jobs</h3>
            <div className="filters-grid">
              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Bangalore"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Employment Type</label>
                <select
                  name="employmentType"
                  value={filters.employmentType}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Experience Level</label>
                <select
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Levels</option>
                  <option value="0 Years">Fresher</option>
                  <option value="1 Years">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="btn-reset"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.jobId} className="job-card" onClick={() => navigate(`/jobs/${job.jobId}`)}>
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <button
                    className="btn-quick-apply"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job.jobId}`);
                    }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>

                <p className="job-company">{job.companyName}</p>

                <div className="job-card-meta">
                  <span className="meta-item">
                    <MapPin size={14} />
                    {job.location}
                  </span>
                  <span className="meta-item">
                    <Briefcase size={14} />
                    {job.employmentType}
                  </span>
                </div>

                <div className="job-salary">
                  <DollarSign size={16} />
                  ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                </div>

                <button
                  className="btn-view-job"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job.jobId}`);
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <Search size={40} />
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={resetFilters} className="btn-reset-large">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
