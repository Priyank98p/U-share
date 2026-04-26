// client/src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // We will change this to your deployed backend URL later
  baseURL: "http://localhost:8000/api/v1", 
  // Crucial for MERN stacks: ensures JWT cookies are sent with every request
  withCredentials: true, 
});

export default axiosInstance;