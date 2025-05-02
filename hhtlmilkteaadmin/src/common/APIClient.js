import axios from "axios";
import { BASE_URL } from "./Constant";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        console.error("Access denied: You don't have permission to access this resource");
        Notification.error("Bạn không có quyền truy cập vào tài nguyên này");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
