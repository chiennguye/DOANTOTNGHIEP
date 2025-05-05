import {
  Button,
  Card,
  CardContent,
  CardMedia,
  FormHelperText,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import voucher from "./../../../assets/img/voucher.jpg";
import {
  VoucherListAction,
  VoucherCheckCodeAction,
} from "./../../../store/actions/VoucherAction";
import moment from "moment";
import { useForm } from "react-hook-form";
import Notification from "./../../../common/Notification";

const useStyles = makeStyles((theme) => ({
  header: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #ececec",
    display: "flex",
  },
  root: {
    display: "flex",
    cursor: "pointer",
  },
  title: {
    color: "#7f7f7f",
    fontSize: 14,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 200,
  },
  voucher: {
    paddingRight: 20,
    paddingBottom: 20,
  },
  voucherContainer: {
    marginLeft: "50%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10%",
    },
  },
  pointsAnimation: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#4CAF50",
    animation: "$floatUp 2s ease-out forwards",
    zIndex: 1000,
  },
  "@keyframes floatUp": {
    "0%": {
      opacity: 1,
      transform: "translate(-50%, -50%)",
    },
    "100%": {
      opacity: 0,
      transform: "translate(-50%, -150%)",
    },
  },
  remainingDays: {
    color: "#f44336",
    fontWeight: "bold",
  },
}));

const Voucher = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { vouchers } = useSelector((state) => state.voucher);
  const { user } = useSelector((state) => state.auth);
  const { handleSubmit, errors, register } = useForm();
  const [message, setMessage] = useState("");
  const [showPoints, setShowPoints] = useState(null);

  useEffect(() => {
    VoucherListAction(user?.username)(dispatch);
  }, [dispatch, user?.username]);

  const calculateRemainingDays = (endDate) => {
    const today = moment();
    const end = moment(endDate);
    const remainingDays = end.diff(today, 'days');
    return remainingDays;
  };

  const onSubmit = (data) => {
    data.id = user.id;
    data.username = user.username;
    VoucherCheckCodeAction(data)(dispatch).then((res) => {
      setMessage(res?.message);
      if (res?.message === "Mã được sử dụng thành công") {
        // Find the used voucher to get its points
        const usedVoucher = vouchers.find(v => v.name === data.code);
        if (usedVoucher) {
          setShowPoints(usedVoucher.mark);
          setTimeout(() => setShowPoints(null), 2000);
        }
      }
    });
  };

  const handleCode = (data) => {
    navigator.clipboard.writeText(data);
    Notification.info(`Đã copy: ${data}`);
  };

  return (
    <React.Fragment>
      {showPoints && (
        <div className={classes.pointsAnimation}>
          +{showPoints} điểm
        </div>
      )}
      <div className={classes.header}>
        <div>
          <Typography variant="h6">VOUCHER</Typography>
          <Typography className={classes.title}>
            Quản lý các voucher của bạn
          </Typography>
        </div>

        <div className={classes.voucherContainer}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
            <div>
              {message && (
                <FormHelperText
                  style={{ color: message.includes("thành công") ? "green" : "red" }}
                  id="component-error-text"
                >
                  {message}
                </FormHelperText>
              )}
              <TextField
                label="Mã voucher"
                name="code"
                inputRef={register({
                  required: {
                    value: true,
                    message: "Bạn chưa nhập mã Voucher",
                  },
                })}
              />
              {errors.code?.message && (
                <FormHelperText
                  style={{ color: "red" }}
                  id="component-error-text"
                >
                  {errors.code?.message}
                </FormHelperText>
              )}
            </div>
            <Button
              type="submit"
              size="small"
              color="primary"
              variant="contained"
              style={{ marginLeft: 10, marginTop: 20, width: 90, height: 35 }}
            >
              Xác nhận
            </Button>
          </form>
        </div>
      </div>

      <Grid
        container
        style={{
          display: "flex",
          padding: 20,
          height: "50vh",
          overflowY: "auto",
        }}
      >
        {vouchers &&
          vouchers.map((item, index) => {
            const remainingDays = calculateRemainingDays(item.endDate);
            return (
              <Grid
                key={index}
                item
                md={6}
                xs={12}
                sm={12}
                className={classes.voucher}
              >
                <Card
                  className={classes.root}
                  onClick={() => handleCode(item.name)}
                >
                  <CardMedia
                    className={classes.cover}
                    image={voucher}
                    title="Voucher 2025"
                  />
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Typography component="h5" variant="h5">
                        {item.name}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Hạn sử dụng: {moment(item.endDate).format("DD-MM-YYYY")}
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        Giá trị: {item.mark} điểm
                      </Typography>
                      <Typography variant="subtitle2" className={classes.remainingDays}>
                        Còn lại: {remainingDays} ngày
                      </Typography>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </React.Fragment>
  );
};

export default Voucher;
