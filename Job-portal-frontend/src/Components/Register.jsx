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
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    role: 'candidate',
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

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email and password are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      // Backend expects: { name, email, password, mobile, role }
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile || null,
        role: formData.role,
        createdOn: "2026-06-14T20:08:28.691Z"
      };

      // Backend response: { message: "success", data: { id, name, email, mobile, role, createdOn } }
      const response = await authAPI.register(registerData);

      if (response.data.message === 'success') {
        // Auto-login after successful registration
        const loginResponse = await authAPI.login({
          identifier: formData.email, // Use email as identifier
          password: formData.password,
        });

        if (loginResponse.data.message === 'success' && loginResponse.data.data) {
          const { token, user } = loginResponse.data.data;
          if (token && user) {
            login(user, token);
            setFormData({ name: '', email: '', password: '', confirmPassword: '', mobile: '', role: 'candidate' });
            // Redirect based on role
            const redirectPath = user.role?.toLowerCase() === 'recruiter' ? '/recruiter-dashboard' : '/job-seeker-dashboard';
            navigate(redirectPath);
          }
        }
      } else {
        setError(response.data.data || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Backend returns: { message: "failure", data: "error message" }
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
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number (Optional)</label>
              <div className="input-wrapper">
                <Briefcase size={20} />
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="+1 (555) 000-0000"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>I am a:</label>
              <div className="role-selector">
                <div 
                  className={`role-card ${formData.role === 'candidate' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'candidate' }))}
                >
                  <div className="role-icon">👤</div>
                  <h3>Job Seeker</h3>
                  <p>Looking for opportunities</p>
                </div>
                <div 
                  className={`role-card ${formData.role === 'recruiter' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'recruiter' }))}
                >
                  <div className="role-icon">🏢</div>
                  <h3>Recruiter</h3>
                  <p>Hiring top talent</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
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
