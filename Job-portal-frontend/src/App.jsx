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
import JobListing from './Components/JobListing';
import JobDetails from './Components/JobDetails';
import EmployeeDashboard from './Components/EmployeeDashboard';
import EmployerDashboard from './Components/EmployerDashboard';
import ProfilePage from './Components/ProfilePage';
import MyApplications from './Components/MyApplications';
import PostJob from './Components/PostJob';

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
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Employee Protected Routes */}
          <Route
            path="/employee-dashboard"
            element={
              // <ProtectedRoute requiredRole="Employee">
                <EmployeeDashboard />
              /* </ProtectedRoute> */
            }
          />
          <Route
            path="/profile"
            element={
              // <ProtectedRoute requiredRole="Employee">
                <ProfilePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              // <ProtectedRoute requiredRole="Employee">
                <MyApplications />
              // </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/employer-dashboard"
            element={
              // <ProtectedRoute requiredRole="Employer">
                <EmployerDashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/employer-profile"
            element={
              // <ProtectedRoute requiredRole="Employer">
                <ProfilePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              // <ProtectedRoute requiredRole="Employer">
                <PostJob />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/my-jobs"
            element={
              // <ProtectedRoute requiredRole="Employer">
                <JobListing />
              // </ProtectedRoute>
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
