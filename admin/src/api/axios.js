import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rg_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('rg_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
