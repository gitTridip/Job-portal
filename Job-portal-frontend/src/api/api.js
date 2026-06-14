import axios from 'axios';

const API_BASE_URL = 'http://localhost:5165/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
// Login Request: { identifier: email|mobile, password: string }
// Login Response: { message: "success", data: { token, expiresAt, user: { id, name, email, mobile, role, createdOn } } }
export const authAPI = {
  register: (data) => {
    // Payload: { name, email, password, mobile, role }
    return api.post('/auth/register', data);
  },
  login: (data) => {
    // Payload: { identifier: email|mobile, password }
    return api.post('/auth/login', { 
      identifier: data.identifier || data.email, 
      password: data.password 
    });
  },
  logout: () => api.post('/auth/logout'),
};

// Drive endpoints - Job Drives listing and details
// All responses: { message: "success|failure", data: {...} | [...] }
export const driveAPI = {
  // GET /api/drives - List all drives
  // Response: { message: "success", data: [{ driveId, title, companyName, description, city, venue, driveDate, reportingTime, qualificationRequired, experienceRequired, contactPerson, contactEmail, status, createdBy, createdOn, updatedOn }, ...] }
  getAll: () => api.get('/drives'),
  
  // GET /api/drives/{id} - Get specific drive
  // Response: { message: "success", data: { driveId, title, companyName, description, city, venue, driveDate, reportingTime, qualificationRequired, experienceRequired, contactPerson, contactEmail, status, createdBy, createdOn, updatedOn } }
  getById: (id) => api.get(`/drives/${id}`),
  
  // POST /api/drives - Create drive (Admin only, requires JWT)
  // Payload: { title, companyName, description, city, venue, driveDate (yyyy-MM-dd), reportingTime (HH:mm:ss), qualificationRequired, experienceRequired, contactPerson, contactEmail }
  // Response: { message: "success", data: { driveId, title, companyName, description, city, venue, driveDate, reportingTime, qualificationRequired, experienceRequired, contactPerson, contactEmail, status, createdBy, createdOn } }
  create: (data) => api.post('/drives', data),
  
  // PUT /api/drives/{id} - Update drive (Admin only, requires JWT)
  // Payload: { title, companyName, description, city, venue, driveDate (yyyy-MM-dd), reportingTime (HH:mm:ss), qualificationRequired, experienceRequired, contactPerson, contactEmail }
  // Response: { message: "success", data: { driveId: <id> } }
  update: (id, data) => api.put(`/drives/${id}`, data),
  
  // DELETE /api/drives/{id} - Delete drive (Admin only, requires JWT)
  // Response: { message: "success", data: "Drive deleted." }
  delete: (id) => api.delete(`/drives/${id}`),
};

// Alias for backward compatibility
export const jobsAPI = driveAPI;

// Placeholder APIs for future implementation
export const employeeAPI = {
  getProfile: () => api.get('/employee/profile'),
  updateProfile: (data) => api.put('/employee/profile', data),
};

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/employee/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const dashboardAPI = {
  getEmployeeDashboard: () => api.get('/dashboard/employee'),
  getEmployerDashboard: () => api.get('/dashboard/employer'),
};

export const applicationsAPI = {
  getMyApplications: () => api.get('/applications/my'),
  applyForDrive: (driveId) => api.post(`/applications/apply/${driveId}`),
};

export default api;
