import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      // Backend expects: { identifier: email|mobile, password }
      const response = await authAPI.login({
        identifier: formData.email, // Can be email or mobile
        password: formData.password
      });

      // Backend response: { status: "success", data: { Token, ExpiresAt, user: { Id, Name, Email, Mobile, Role, CreatedOn } } }
      if (response.data.status === 'success' && response.data.data) {
        const { Token, user } = response.data.data;
        if (Token && user) {
          login(user, Token);
          navigate('/drives');
        } else {
          setError('Login failed. Invalid response from server.');
        }
      } else {
        setError(response.data.data || 'Login failed. Please try again.');
      }
    } catch (err) {
      // Backend returns: { status: "failure", data: "error message" }
      const errorMessage = err.response?.data?.data || err.message || 'Login failed. Please try again.';
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
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

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

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spinner" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="auth-footer">
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </p>
          </form>
        </div>

        <div className="auth-illustration">
          <div className="illustration-card">
            <Mail size={80} />
            <h3>Sign In to JobHub</h3>
            <p>Access your profile and manage your career or job listings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
