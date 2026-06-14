import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Target, ArrowRight, Star, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Job Drives & Career Opportunities
            </h1>
            <p className="hero-subtitle">
              Browse upcoming campus placements and hiring drives. Find the perfect fit for your career with leading companies.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-hero-primary"
                onClick={() => navigate('/drives')}
              >
                Explore Drives
                <ArrowRight size={20} />
              </button>
              {!isAuthenticated && (
                <button 
                  className="btn-hero-secondary"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </button>
              )}
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-content">
              <Briefcase size={120} />
              <Calendar size={80} style={{ marginTop: '-20px', marginLeft: '60px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Use JobHub Drives?</h2>
            <p>Everything you need to know about our job drive platform</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Organized Schedule</h3>
              <p>Access complete drive schedules with dates, times, and venues all in one place.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MapPin size={32} />
              </div>
              <h3>Location Details</h3>
              <p>Get clear location information, reporting times, and venue details for every drive.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Eligibility Info</h3>
              <p>Know the exact qualifications and experience required before applying.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Direct Contact</h3>
              <p>Connect directly with recruiters and get your questions answered instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="how-container">
          <div className="section-header">
            <h2>How To Use JobHub</h2>
            <p>Simple steps to find your next opportunity</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Drives</h3>
              <p>Visit our drives section to see all upcoming job fairs and recruitment drives.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Check Details</h3>
              <p>Read comprehensive information about each drive, including eligibility criteria.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Contact Info</h3>
              <p>View recruiter contact details and reach out to them directly.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Attend & Apply</h3>
              <p>Attend the drive on the scheduled date and apply for positions directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Start Your Career Journey Today</h2>
          <p>Explore job drives and connect with top companies</p>
          <div className="cta-buttons">
            <button 
              className="btn-cta-primary"
              onClick={() => navigate('/drives')}
            >
              View All Drives
            </button>
            <button 
              className="btn-cta-secondary"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>JobHub</h4>
            <p>Connecting talents with opportunities</p>
          </div>
          <div className="footer-section">
            <h4>For Job Seekers</h4>
            <ul>
              <li><a href="#browse">Browse Jobs</a></li>
              <li><a href="#profile">Build Profile</a></li>
              <li><a href="#apply">Apply Now</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Employers</h4>
            <ul>
              <li><a href="#post">Post Job</a></li>
              <li><a href="#find">Find Candidates</a></li>
              <li><a href="#manage">Manage Hiring</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 JobHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
