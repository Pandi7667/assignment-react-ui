import axios from "axios";

// Create API client
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor (optional - for adding auth tokens later)
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here later if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional - for error handling)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized");
      // Handle logout or redirect
    }
    return Promise.reject(error);
  }
);

export default apiClient;