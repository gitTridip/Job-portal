import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Employee endpoints
export const employeeAPI = {
  getProfile: () => api.get('/employee/profile'),
  updateProfile: (data) => api.put('/employee/profile', data),
};

// Resume endpoints
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resumeFile', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  get: () => api.get('/resume'),
  delete: () => api.delete('/resume'),
};

// Company endpoints
export const companyAPI = {
  getAll: () => api.get('/companies'),
  getMyCompany: () => api.get('/companies/my-company'),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  getById: (id) => api.get(`/companies/${id}`),
};

// Jobs endpoints
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
};

// Applications endpoints
export const applicationsAPI = {
  create: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getById: (id) => api.get(`/applications/${id}`),
  getByJobId: (jobId) => api.get(`/applications/job/${jobId}`),
  getDetails: (applicationId) => api.get(`/applications/details/${applicationId}`),
  shortlist: (id) => api.put(`/applications/${id}/shortlist`),
  reject: (id) => api.put(`/applications/${id}/reject`),
};

// Dashboard endpoints
export const dashboardAPI = {
  getEmployeeDashboard: () => api.get('/dashboard/employee'),
  getEmployerDashboard: () => api.get('/dashboard/employer'),
};

export default api;
