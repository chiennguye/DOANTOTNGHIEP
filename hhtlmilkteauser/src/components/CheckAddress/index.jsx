import {
  FormHelperText,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GroupOrderFindAllAction } from "../../store/actions/GroupOrderAction";
import OrderService from "../../services/OrderService";

const useStyles = makeStyles((theme) => ({
  btnReloadMap: {
    marginTop: 20,
    marginBottom: 10,
    padding: "12px 24px",
    border: "none",
    backgroundColor: "#2454b5",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "16px",
    width: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#1a3d8f",
    },
  },
  btnReloadMapDisable: {
    marginTop: 20,
    marginBottom: 10,
    padding: "12px 24px",
    color: "white",
    border: "none",
    backgroundColor: "#cccccc",
    fontWeight: "bold",
    cursor: "not-allowed",
    borderRadius: "4px",
    fontSize: "16px",
    width: "100%",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(4),
    },
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: theme.spacing(4),
    color: "#333",
    fontWeight: "bold",
  },
  formContainer: {
    padding: theme.spacing(2),
  },
  inputField: {
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      "&:hover fieldset": {
        borderColor: "#2454b5",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#666",
    },
  },
  noteField: {
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
    },
  },
  errorText: {
    color: "#d32f2f",
    marginTop: "4px",
    fontSize: "0.75rem",
  },
}));

const CheckAddress = () => {
  const classes = useStyles();
  const history = useHistory();
  const { order } = useSelector((state) => state.order);
  const { customer } = useSelector((state) => state.customer);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    to: "",
    phone: "",
    note: ""
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  // support group member
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Fill user's address when component mounts
  useEffect(() => {
    if (customer?.address) {
      setAddress(prev => ({
        ...prev,
        to: customer.address
      }));
      setValue("to_places", customer.address);
    }
    if (customer?.phone) {
      setAddress(prev => ({
        ...prev,
        phone: customer.phone
      }));
      setValue("phone", customer.phone);
    }
  }, [customer, setValue]);

  useEffect(() => {
    if (Object.keys(order).length !== 0) {
      const handleGroupOrder = () => {
        if (
          (!Object.is(localStorage.getItem("member", null)) &&
            !Object.is(localStorage.getItem("member"), null)) ||
          localStorage.getItem("user")
        ) {
          const groupMember = JSON.parse(localStorage.getItem("groupMember"));
          const username = groupMember?.username;
          const type = "team";
          const orderID = groupMember?.orderID;
          GroupOrderFindAllAction({ username, type, orderID })(dispatch);
        }

        if (auth?.user?.token) {
          const username = auth?.user?.username;
          const type = "team";
          const orderID = order?.id;
          GroupOrderFindAllAction({ username, type, orderID })(dispatch);
        }
      };
      
      handleGroupOrder();
    }
  }, [auth?.user?.token, auth?.user?.username, dispatch, order, order?.id]);

  useEffect(() => {
    const checkOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');

      if (orderId) {
        try {
          const response = await OrderService.getOrderById(orderId);
          if (response.data) {
            dispatch({ type: 'SET_ORDER', payload: response.data });
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          window.location.href = "/";
        }
      } else if (!order) {
        window.location.href = "/";
      }
    };
    
    checkOrder();
  }, [order, dispatch]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Trigger validation before proceeding
      const isValid = await trigger();
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      
      data.shippingPrice = "15000";
      data.to = address.to;
      await history.push("/payment", { address: data });
    } catch (error) {
      console.error("Error submitting address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (field) => (e) => {
    const value = e.target.value;
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h5" className={classes.title}>
            Địa chỉ giao hàng
          </Typography>
          <div className={classes.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    label="Nhập địa chỉ giao hàng"
                    fullWidth
                    variant="outlined"
                    placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện)"
                    onChange={handleAddressChange('to')}
                    value={address.to}
                    inputRef={register({
                      required: "Vui lòng nhập địa chỉ giao hàng",
                      minLength: {
                        value: 10,
                        message: "Địa chỉ phải có ít nhất 10 ký tự"
                      },
                      validate: {
                        hasNumber: value => /\d/.test(value) || "Địa chỉ phải có số nhà",
                        hasAddress: value => /(đường|phố|ngõ|ngách|hẻm|tổ|khu|phường|xã|quận|huyện)/i.test(value) || "Địa chỉ phải có tên đường/phố và quận/huyện"
                      }
                    })}
                    name="to_places"
                    error={!!errors.to_places}
                    helperText={errors.to_places?.message}
                    className={classes.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Số điện thoại"
                    variant="outlined"
                    value={address.phone}
                    onChange={handleAddressChange('phone')}
                    inputRef={register({
                      required: "Số điện thoại không được để trống",
                      pattern: {
                        value: /^0[1-9]{1}[0-9]{8}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                    fullWidth
                    className={classes.inputField}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={3}
                    name="note"
                    label="Ghi chú"
                    variant="outlined"
                    value={address.note}
                    onChange={handleAddressChange('note')}
                    inputRef={register}
                    fullWidth
                    className={classes.noteField}
                    placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <button
                    type="submit"
                    id="btnSubmit"
                    className={classes.btnReloadMap}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Tiếp theo"}
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Paper>
      </main>
    </div>
  );
};

export default CheckAddress;
