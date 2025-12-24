import api from './axios';

// Auth API
export const authAPI = {
  registerUser: async (data) => api.post('/auth/register', data),
  loginUser: async (data) => api.post('/auth/login', data),
  logoutUser: async () => api.post('/auth/logout'),
  getCurrentUser: async () => api.get('/auth/me')
};

// Programs API
export const programsAPI = {
  fetchPrograms: async ({ page = 1, search = '' }) => 
    api.get(`/programs?page=${page}&search=${search}`),
  fetchProgramById: async (id) => 
    api.get(`/programs/${id}`),
  createProgram: async (data) => 
    api.post('/programs', data),
  updateProgram: async ({ id, data }) => 
    api.put(`/programs/${id}`, data),
  deleteProgram: async (id) => 
    api.delete(`/programs/${id}`)
};

// Applications API
export const applicationsAPI = {
  submitApplication: async (data) => 
    api.post('/applications', data),
  fetchApplications: async ({ page = 1, status = '', program = '' }) => 
    api.get(`/applications?page=${page}&status=${status}&program=${program}`),
  fetchApplicationById: async (id) => 
    api.get(`/applications/${id}`),
  updateApplicationStatus: async ({ id, data }) => {
    // Ensure we're sending all required fields
    const payload = {
      status: data.status,
      reviewComment: data.reviewComment || ''
    };
    return api.put(`/applications/${id}`, payload);
  },
  fetchApplicationStats: async () => 
    api.get('/applications/stats/overview')
};