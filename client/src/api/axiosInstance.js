import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "";
const finalBaseUrl = rawBaseUrl.endsWith('/api/v1') 
  ? rawBaseUrl 
  : `${rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl}/api/v1`;

const axiosInstance = axios.create({
  baseURL: finalBaseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid redirecting if already on login or register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // We can dispatch logout here or just redirect and let the component handle state.
        // For simplicity and avoiding circular dependency with Redux store:
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;