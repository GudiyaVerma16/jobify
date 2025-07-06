import axios from "axios";

// Create axios instance with base URL
const authFetch = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api/v1",
});

// Request interceptor
authFetch.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Handle logout here if needed
      // This will be handled in the app context
    }
    return Promise.reject(error);
  }
);

export default authFetch;
