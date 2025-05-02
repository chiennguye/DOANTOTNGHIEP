import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  FormHelperText,
} from "@material-ui/core";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import logo from "./../../assets/img/logo.png";
import { useForm } from "react-hook-form";
import { AuthLoginAction } from "../../store/actions/AuthAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage("");
    try {
      await dispatch(AuthLoginAction(data));
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user) {
      if (auth.user.error === 401) {
        setMessage("Tài khoản hoặc mật khẩu không đúng");
        return;
      }
      
      if (auth.user.roles) {
        localStorage.setItem("user", JSON.stringify(auth.user));
        if (auth.user.roles.includes("ROLE_SHIPPER")) {
          history.push("/shipper");
        } else if (auth.user.roles.includes("ROLE_ADMIN")) {
          history.push("/dashboard");
        } else {
          setMessage("Tài khoản không có quyền truy cập");
        }
      }
    }
  }, [auth, history]);

  return (
    <>
      <Grid container style={{ minHeight: "95vh" }}>
        <Grid
          container
          item
          xs={12}
          sm={12}
          alignItems="center"
          direction="column"
          justifyContent="center"
          style={{ padding: 10 }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 400,
              minWidth: 300,
            }}
          >
            <Grid container justifyContent="center">
              <img src={logo} alt="logo" loading="lazy" width="100" />
            </Grid>
            <FormHelperText
              style={{
                color: "red",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {message}
            </FormHelperText>
            <TextField
              label="Tài khoản"
              autoComplete="off"
              margin="normal"
              fullWidth
              name="username"
              inputRef={register({ required: true })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            {errors.username && (
              <FormHelperText style={{ color: "red" }}>
                Tài khoản chưa nhập
              </FormHelperText>
            )}
            <TextField
              label="Mật khẩu"
              type="password"
              autoComplete="current-password"
              margin="normal"
              fullWidth
              name="password"
              inputRef={register({ required: true })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded />
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && (
              <FormHelperText style={{ color: "red" }}>
                Mật khẩu chưa nhập
              </FormHelperText>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
