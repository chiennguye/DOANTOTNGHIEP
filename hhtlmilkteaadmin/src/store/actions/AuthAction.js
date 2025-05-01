import AuthService from "../../services/AuthService";
import { login, logout } from "../reducers/AuthReducer";

export const AuthLoginAction = (data) => async (dispatch) => {
  try {
    const response = await AuthService.login(data);
    if (response && response.data) {
      dispatch(login(response.data));
    } else {
      dispatch(login({ error: 401 }));
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch(login({ error: 401 }));
  }
};

export const AuthLogoutAction = () => (dispatch) => {
  AuthService.logout();
  dispatch(logout());
};
