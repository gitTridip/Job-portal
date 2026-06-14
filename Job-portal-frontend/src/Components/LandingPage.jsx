import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Target, ArrowRight, Star, MapPin, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'Employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/employer-dashboard');
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Dream Job or Hire Top Talent
            </h1>
            <p className="hero-subtitle">
              Connect with the best opportunities and talents in the job market. 
              Start your career journey or build your perfect team today.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-hero-primary"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight size={20} />
              </button>
              <button 
                className="btn-hero-secondary"
                onClick={() => navigate('/jobs')}
              >
                Browse Jobs
              </button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-content">
              <Briefcase size={120} />
              <Users size={100} style={{ marginTop: '-30px', marginLeft: '60px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose JobHub?</h2>
            <p>Discover the features that make us the best job portal</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Quick & Easy</h3>
              <p>Find or post jobs in seconds with our simple and intuitive interface.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Perfect Matches</h3>
              <p>Advanced filtering helps employers find the right candidates quickly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Connect Directly</h3>
              <p>Direct communication between employers and candidates for better outcomes.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>Verified Profiles</h3>
              <p>All profiles are verified ensuring quality and authenticity in the portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="how-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get started</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up as a job seeker or employer in just a few minutes.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Complete Profile</h3>
              <p>Add your details, skills, and preferences to your profile.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Browse & Apply</h3>
              <p>Find jobs that match your skills and apply instantly.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Hired</h3>
              <p>Get shortlisted and connect with your future employer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Start?</h2>
          <p>Join thousands of professionals and employers on JobHub</p>
          <div className="cta-buttons">
            <button 
              className="btn-cta-primary"
              onClick={() => navigate('/register')}
            >
              Create Account Now
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
