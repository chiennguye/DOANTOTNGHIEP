import React, { useEffect, useState, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AuthLoginAction } from "./../../../src/store/actions/AuthAction";
import { FormHelperText, InputAdornment } from "@material-ui/core";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import { GroupOrderFindAllAction } from "../../store/actions/GroupOrderAction";
import AuthService from "../../services/AuthService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const autocompleteRef = useRef(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Đợi Google Maps API load xong
    const initAutocomplete = () => {
      if (window.google && window.google.maps) {
        const input = document.getElementById('address-input');
        if (input) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: 'VN' }
          });
        }
      }
    };

    // Kiểm tra nếu Google Maps API đã load
    if (window.google && window.google.maps) {
      initAutocomplete();
    } else {
      // Nếu chưa load xong, đợi sự kiện load
      window.addEventListener('load', initAutocomplete);
    }

    return () => {
      window.removeEventListener('load', initAutocomplete);
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log("Bắt đầu đăng nhập với username:", data.username);
      
      // Xóa localStorage trước khi đăng nhập
      localStorage.clear();
      console.log("Đã xóa localStorage");
      
      const response = await AuthService.login(data);
      console.log("Response từ server:", response.data);
      
      // Kiểm tra role từ response
      const roles = response.data.roles || [];
      console.log("Roles từ response:", roles);
      
      if (!roles || roles.length === 0) {
        console.error("Không có role trong response");
        setError("Tài khoản không có quyền truy cập");
        return;
      }

      // Kiểm tra role hợp lệ
      const validRoles = ["ROLE_USER", "ROLE_ADMIN"];
      const hasValidRole = roles.some(role => validRoles.includes(role));
      
      if (!hasValidRole) {
        console.error("Không có role hợp lệ:", roles);
        setError("Tài khoản không có quyền truy cập");
        return;
      }

      // Lưu role vào localStorage
      localStorage.setItem("role", roles[0]);
      console.log("Đã lưu role:", roles[0]);

      // Chuyển hướng dựa vào role và load lại trang
      if (roles.includes("ROLE_ADMIN")) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.response?.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else if (error.response?.status === 403) {
        setError("Tài khoản không có quyền truy cập");
      } else {
        setError("Đã xảy ra lỗi, vui lòng thử lại sau");
      }
    }
  };

  //support group member
  useEffect(() => {
    if (
      !Object.is(localStorage.getItem("member", null)) &&
      !Object.is(localStorage.getItem("member"), null)
    ) {
      setTimeout(() => {
        const groupMember = JSON.parse(localStorage.getItem("groupMember"));
        const username = groupMember?.username;
        const type = "team";
        const orderID = groupMember?.orderID;
        GroupOrderFindAllAction({ username, type, orderID })(dispatch);
      }, 500);
    }
  }, [dispatch]);

  useEffect(() => {
    if (auth.user) {
      if (Object.is(401, auth.user.error)) {
        window.location.href = "/signin";
        return;
      }
      if (auth.user.roles.includes("ROLE_ADMIN")) {
        window.location.href = "/signin";
        return;
      }
      if (auth.user.roles.includes("ROLE_USER")) {
        localStorage.setItem("user", JSON.stringify(auth.user));
        window.location.href = "/home";
      }
    }
  }, [auth]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          {error && (
            <FormHelperText
              style={{
                color: "red",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {error}
            </FormHelperText>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="username"
            label="Tài khoản"
            autoComplete="off"
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
              Tài khoản chưa được nhập
            </FormHelperText>
          )}

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            autoComplete="current-password"
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
              Mật khẩu chưa được nhập
            </FormHelperText>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Đăng nhập
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forget" style={{ textDecoration: "none" }}>
                Quên mật khẩu?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Bạn chưa có tài khoản? Tạo tài khoản
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
