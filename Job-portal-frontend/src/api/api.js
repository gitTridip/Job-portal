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
// Login Response: { status: "success", data: { Token, ExpiresAt, user: { Id, Name, Email, Mobile, Role, CreatedOn } } }
// Register Request: { Name, Email, Password, Mobile?, Role }
// Register Response: { status: "success", data: { Id, Name, Email, Mobile, Role, CreatedOn } }
export const authAPI = {
  register: (data) => {
    // Payload: { Name, Email, Password, Mobile, Role }
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
// Response format for all drives: { status: "success", data: {...} | [...] }
export const driveAPI = {
  // GET /api/drive
  // Response: { status: "success", data: [{ DriveId, Title, CompanyName, Description, City, Venue, DriveDate, ReportingTime, QualificationRequired, ExperienceRequired, ContactPerson, ContactEmail, Status, AdminId, CreatedOn, UpdatedOn }, ...] }
  getAll: () => api.get('/drive'),
  
  // GET /api/drive/{id}
  // Response: { status: "success", data: { DriveId, Title, CompanyName, Description, City, Venue, DriveDate, ReportingTime, QualificationRequired, ExperienceRequired, ContactPerson, ContactEmail, Status, AdminId, CreatedOn, UpdatedOn } }
  getById: (id) => api.get(`/drive/${id}`),
  
  // POST /api/drive (Admin only, requires JWT)
  // Payload: { Title, CompanyName, Description, City, Venue, DriveDate, ReportingTime, QualificationRequired, ExperienceRequired, ContactPerson, ContactEmail }
  // Response: { status: "success", data: { DriveId, Title, CompanyName, Description, City, Venue, DriveDate, ReportingTime, QualificationRequired, ExperienceRequired, ContactPerson, ContactEmail, Status, AdminId, CreatedOn } }
  create: (data) => api.post('/drive', data),
};

export default api;
