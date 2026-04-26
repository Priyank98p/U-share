import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Note: backend is running on 3000 usually, but let's check index.js
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