import api from "./../common/APIClient";

class AuthService {
  // Kiểm tra token có hợp lệ không
  isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Decode token để lấy thông tin
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;

      // Kiểm tra token có hết hạn chưa
      if (payload.exp < currentTime) {
        console.log("Token đã hết hạn");
        this.clearAll();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi kiểm tra token:", error);
      this.clearAll();
      return false;
    }
  };

  login = async (data) => {
    try {
      console.log("Gọi API login với data:", { username: data.username });
      
      // Xóa token cũ trước khi login
      this.clearAll();
      
      const response = await api.post("/auth/signin", data);
      console.log("Login response:", response.data);
      
      if (response.data.token) {
        // Lưu token mới
        localStorage.setItem("token", response.data.token);
        console.log("Đã lưu token mới");
        
        // Lưu thông tin user
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("Đã lưu thông tin user");
      }
      
      return response;
    } catch (error) {
      console.error("Login API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  register = async (data) => {
    try {
      console.log("Gọi API register với data:", { username: data.username });
      const response = await api.post("/auth/signup", data);
      console.log("Register response:", response.data);
      return response;
    } catch (error) {
      console.error("Register API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  logout = async () => {
    try {
      console.log("Gọi API logout");
      await api.post("/auth/logout");
      console.log("Logout thành công");
      this.clearAll();
    } catch (error) {
      console.error("Logout error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      this.clearAll();
    }
  };

  clearAll = () => {
    console.log("Xóa toàn bộ localStorage");
    localStorage.clear();
  };

  checkEmail = async (data) => {
    try {
      console.log("Gọi API check email:", data.email);
      const response = await api.get(`/auth/${data.email}`);
      console.log("Check email response:", response.data);
      return response;
    } catch (error) {
      console.error("Check email API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  updatePass = async (data) => {
    try {
      console.log("Gọi API update password");
      const response = await api.post("/auth/reset-pass", data);
      console.log("Update password response:", response.data);
      return response;
    } catch (error) {
      console.error("Update password API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };
}

export default new AuthService();
