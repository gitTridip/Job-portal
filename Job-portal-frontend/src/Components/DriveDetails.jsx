import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Mail, Phone, ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { driveAPI } from '../api/api';
import './DriveDetails.css';

const DriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDriveDetails();
  }, [id]);

  const fetchDriveDetails = async () => {
    try {
      setLoading(true);
      const response = await driveAPI.getById(id);
      if (response.data.message === 'success') {
        setDrive(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch drive details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="drive-details-loading">
        <Loader size={48} className="spinner" />
        <p>Loading drive details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="drive-details-container">
        <button className="back-button" onClick={() => navigate('/drives')}>
          <ArrowLeft size={20} />
          Back to Drives
        </button>
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="drive-details-container">
        <button className="back-button" onClick={() => navigate('/drives')}>
          <ArrowLeft size={20} />
          Back to Drives
        </button>
        <div className="no-data">
          <p>Drive not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drive-details-container">
      <button className="back-button" onClick={() => navigate('/drives')}>
        <ArrowLeft size={20} />
        Back to Drives
      </button>

      <div className="drive-details-card">
        <div className="drive-details-header">
          <div>
            <h1>{drive.title}</h1>
            <p className="company-name">{drive.companyName}</p>
          </div>
          <span className={`status-badge ${drive.status?.toLowerCase()}`}>
            {drive.status}
          </span>
        </div>

        {drive.description && (
          <div className="description-section">
            <h2>About the Drive</h2>
            <p>{drive.description}</p>
          </div>
        )}

        <div className="details-grid">
          <div className="detail-section">
            <h3>Drive Information</h3>
            <div className="detail-group">
              <div className="detail-row">
                <Calendar size={20} />
                <div>
                  <span className="label">Date</span>
                  <span className="value">
                    {new Date(drive.driveDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <Clock size={20} />
                <div>
                  <span className="label">Reporting Time</span>
                  <span className="value">{drive.reportingTime}</span>
                </div>
              </div>

              <div className="detail-row">
                <MapPin size={20} />
                <div>
                  <span className="label">Location</span>
                  <span className="value">{drive.venue}, {drive.city}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Eligibility Criteria</h3>
            <div className="criteria">
              <div className="criteria-item">
                <span className="criteria-label">Qualification Required</span>
                <span className="criteria-value">{drive.qualificationRequired}</span>
              </div>
              {drive.experienceRequired && (
                <div className="criteria-item">
                  <span className="criteria-label">Experience Required</span>
                  <span className="criteria-value">{drive.experienceRequired}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <div className="contact-item">
                <span className="label">Contact Person</span>
                <span className="value">{drive.contactPerson}</span>
              </div>

              <div className="contact-item">
                <Mail size={18} />
                <a href={`mailto:${drive.contactEmail}`} className="email-link">
                  {drive.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="drive-details-footer">
          <p className="last-updated">
            Last updated: {new Date(drive.updatedOn || drive.createdOn).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
