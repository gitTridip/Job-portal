import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: '',
    Mobile: '',
    Role: 'candidate',
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

    if (!formData.Name || !formData.Email || !formData.Password) {
      setError('Name, email and password are required');
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      // Backend expects: { Name, Email, Password, Mobile?, Role }
      const registerData = {
        Name: formData.Name,
        Email: formData.Email,
        Password: formData.Password,
        Mobile: formData.Mobile || null,
        Role: formData.Role,
      };

      // Backend response: { status: "success", data: { Id, Name, Email, Mobile, Role, CreatedOn } }
      const response = await authAPI.register(registerData);

      if (response.data.status === 'success') {
        // Auto-login after successful registration
        const loginResponse = await authAPI.login({
          identifier: formData.Email, // Use email as identifier
          password: formData.Password,
        });

        if (loginResponse.data.status === 'success' && loginResponse.data.data) {
          const { Token, user } = loginResponse.data.data;
          if (Token && user) {
            login(user, Token);
            setFormData({ Name: '', Email: '', Password: '', confirmPassword: '', Mobile: '', Role: 'candidate' });
            navigate('/drives');
          }
        }
      } else {
        setError(response.data.data || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Backend returns: { status: "failure", data: "error message" }
      const errorMessage = err.response?.data?.data || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join JobHub and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="Name">Full Name</label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  placeholder="John Doe"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="Email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="john@example.com"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="Mobile">Mobile Number (Optional)</label>
              <div className="input-wrapper">
                <Briefcase size={20} />
                <input
                  type="tel"
                  id="Mobile"
                  name="Mobile"
                  placeholder="+1 (555) 000-0000"
                  value={formData.Mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="Role">Role</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="Role"
                    value="candidate"
                    checked={formData.Role === 'candidate'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Job Seeker
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="Role"
                    value="recruiter"
                    checked={formData.Role === 'recruiter'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Recruiter
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="Password">Password</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="Password"
                  name="Password"
                  placeholder="Enter password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spinner" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>

        <div className="auth-illustration">
          <div className="illustration-card">
            <Briefcase size={80} />
            <h3>Welcome to JobHub</h3>
            <p>Find amazing opportunities or build your perfect team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
