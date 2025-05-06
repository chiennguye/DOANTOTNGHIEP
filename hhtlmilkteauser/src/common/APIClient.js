import axios from "axios";
import { BASE_URL } from "./Constant";
import AuthService from "../services/AuthService";

// Danh sách các route không cần xác thực
const PUBLIC_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/logout',
  '/rating/list'
];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => config.url.includes(route));
    
    // Kiểm tra token trước khi gửi request
    if (!isPublicRoute && !AuthService.isTokenValid()) {
      console.log("Token không hợp lệ, chuyển về trang login");
      window.location.href = "/signin";
      return Promise.reject("Token không hợp lệ");
    }

    const token = localStorage.getItem("token");
    
    console.log("Request interceptor:", {
      url: config.url,
      isPublicRoute,
      hasToken: !!token,
      method: config.method
    });
    
    if (token && !isPublicRoute) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // console.log("Đã thêm token vào header:", config.headers["Authorization"]);
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response success:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Chỉ xử lý lỗi 401 cho các route cần xác thực
    if (error.response?.status === 401 && !PUBLIC_ROUTES.some(route => error.config?.url.includes(route))) {
      console.log("Token không hợp lệ hoặc hết hạn, xóa token và chuyển về trang login");
      AuthService.clearAll();
      window.location.href = "/signin";
    }
    
    return Promise.reject(error);
  }
);

export default api;