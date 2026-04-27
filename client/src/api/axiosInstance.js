import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "",
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