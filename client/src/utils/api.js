import axios from "axios";

// Use environment variable for API base URL
const api = axios.create({
  baseURL:  "https://machine-test-for-mern-stack.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token (auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔴 Token expired or invalid. Logging out...");
      localStorage.removeItem("token"); // Remove invalid token
      window.location.href = "/"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
