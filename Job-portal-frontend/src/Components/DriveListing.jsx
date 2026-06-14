import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, AlertCircle, Loader } from 'lucide-react';
import { driveAPI } from '../api/api';
import './DriveListing.css';

const DriveListing = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await driveAPI.getAll();
      if (response.data.message === 'success') {
        setDrives(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch drives. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (driveId) => {
    navigate(`/drive/${driveId}`);
  };

  if (loading) {
    return (
      <div className="drives-loading">
        <Loader size={48} className="spinner" />
        <p>Loading job drives...</p>
      </div>
    );
  }

  return (
    <div className="drives-container">
      <div className="drives-header">
        <h1>Job Drives</h1>
        <p>Explore upcoming campus placements and hiring drives</p>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {drives.length === 0 ? (
        <div className="no-drives">
          <p>No job drives available at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="drives-grid">
          {drives.map((drive) => (
            <div key={drive.driveId} className="drive-card">
              <div className="drive-header">
                <h2>{drive.title}</h2>
                <span className={`status-badge ${drive.status.toLowerCase()}`}>
                  {drive.status}
                </span>
              </div>

              <p className="company-name">{drive.companyName}</p>

              <div className="drive-details">
                <div className="detail-item">
                  <MapPin size={18} />
                  <div>
                    <span className="label">Location</span>
                    <span className="value">{drive.city} • {drive.venue}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <span className="label">Drive Date</span>
                    <span className="value">
                      {new Date(drive.driveDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <Clock size={18} />
                  <div>
                    <span className="label">Reporting Time</span>
                    <span className="value">{drive.reportingTime}</span>
                  </div>
                </div>
              </div>

              <div className="drive-requirements">
                <div className="requirement">
                  <strong>Qualification:</strong> {drive.qualificationRequired}
                </div>
                {drive.experienceRequired && (
                  <div className="requirement">
                    <strong>Experience:</strong> {drive.experienceRequired}
                  </div>
                )}
              </div>

              <div className="drive-contact">
                <span className="contact-label">Contact:</span>
                <span className="contact-info">{drive.contactPerson}</span>
                <a href={`mailto:${drive.contactEmail}`} className="contact-email">
                  {drive.contactEmail}
                </a>
              </div>

              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(drive.driveId)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriveListing;
