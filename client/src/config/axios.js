import axios from "axios";

// Create axios instance with base URL
// Ensure the base URL always includes /api/v1
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL;
  if (!envURL) return "/api/v1";

  // If the URL already includes /api/v1, use it as is
  if (envURL.includes("/api/v1")) return envURL;

  // If it's just the base URL, append /api/v1
  return `${envURL}/api/v1`;
};

const authFetch = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Important for cookies
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
    if (error.response && error.response.status === 401) {
      // Handle logout here if needed
      // This will be handled in the app context
    }
    return Promise.reject(error);
  }
);

export default authFetch;
