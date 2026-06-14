import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { employeeAPI, resumeAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
  });

  useEffect(() => {
    if (user?.role === 'Employee') {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getProfile();
      setProfile(response.data);
      setFormData({
        phone: response.data.phone || '',
        location: response.data.location || '',
        skills: response.data.skills || '',
        experience: response.data.experience || '',
        education: response.data.education || '',
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setUpdating(true);
      await employeeAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are allowed');
      return;
    }

    try {
      setUploadingResume(true);
      await resumeAPI.upload(file);
      setSuccess('Resume uploaded successfully!');
      setResumeFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Loader size={40} className="spinner" />
//         <p>Loading your profile...</p>
//       </div>
//     );
//   }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your professional information</p>
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

        <div className="profile-grid">
          {/* Profile Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
            </div>

            <div className="info-display">
              <div className="info-item">
                <span className="label">Full Name</span>
                <span className="value">{profile?.fullName}</span>
              </div>
              <div className="info-item">
                <span className="label">Email</span>
                <span className="value">{profile?.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Employee ID</span>
                <span className="value">EMP{profile?.employeeId}</span>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={18} /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  <Briefcase size={18} /> Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  placeholder="e.g., React, Node.js, Python"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">
                    <Briefcase size={18} /> Experience (Years)
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    placeholder="2"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">
                    <GraduationCap size={18} /> Education
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    placeholder="e.g., B.Tech in CSE"
                    value={formData.education}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-update"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader size={18} className="spinner" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>

          {/* Resume Section */}
          <div className="resume-section">
            <div className="section-header">
              <h2>Resume</h2>
            </div>

            <div className="resume-card">
              <div className="resume-icon">
                <FileText size={48} />
              </div>

              <p className="resume-instruction">Upload your resume in PDF format</p>

              <label className="file-upload">
                <Upload size={24} />
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                />
              </label>

              {uploadingResume && (
                <p className="uploading-text">
                  <Loader size={16} className="spinner" />
                  Uploading resume...
                </p>
              )}

              <p className="file-hint">Maximum file size: 5MB, PDF only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
