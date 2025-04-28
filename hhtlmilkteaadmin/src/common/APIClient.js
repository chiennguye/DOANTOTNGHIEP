import axios from "axios";
import { BASE_URL } from "./Constant";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const getUser = JSON.parse(localStorage.getItem("user"));

  if (getUser && getUser.token) {
    config.headers.Authorization = `Bearer ${getUser.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      localStorage.removeItem("user");
      return Promise.reject(error);
    }

    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.removeItem("user");
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
