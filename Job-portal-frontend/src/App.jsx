import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/global.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './Components/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';

// Pages
import LandingPage from './Components/LandingPage';
import Register from './Components/Register';
import Login from './Components/Login';
import DriveListing from './Components/DriveListing';
import DriveDetails from './Components/DriveDetails';
import JobSeekerDashboard from './Components/JobSeekerDashboard';
import RecruiterDashboard from './Components/RecruiterDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/drives" element={<DriveListing />} />
          <Route path="/drive/:id" element={<DriveDetails />} />

          {/* Protected Routes - Job Seeker */}
          <Route 
            path="/job-seeker-dashboard" 
            element={
              <ProtectedRoute requiredRole="candidate">
                <JobSeekerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Recruiter */}
          <Route 
            path="/recruiter-dashboard" 
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
