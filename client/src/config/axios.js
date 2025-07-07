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

const baseURL = getBaseURL();
console.log("🌐 Frontend API Base URL:", baseURL);
console.log("🌐 Environment API URL:", process.env.REACT_APP_API_URL);

const authFetch = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for cookies
});

// Request interceptor
authFetch.interceptors.request.use(
  (config) => {
    console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    console.log("📤 Request headers:", config.headers);
    return config;
  },
  (error) => {
    console.log("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
authFetch.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status, response.config.url);
    console.log("📥 Response headers:", response.headers);
    return response;
  },
  (error) => {
    console.log(
      "❌ Response error:",
      error.response?.status,
      error.config?.url
    );
    console.log("❌ Error details:", error.response?.data);
    if (error.response && error.response.status === 401) {
      // Handle logout here if needed
      // This will be handled in the app context
    }
    return Promise.reject(error);
  }
);

export default authFetch;
