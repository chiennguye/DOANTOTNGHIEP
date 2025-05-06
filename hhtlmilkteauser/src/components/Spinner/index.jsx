import React, { useEffect, useState } from "react";
import { makeStyles, Typography, Snackbar, Fade } from "@material-ui/core";
import WheelComponent from "react-wheel-of-prizes";
import "react-wheel-of-prizes/dist/index.css";
import { Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DoneIcon from "@material-ui/icons/Done";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  SpinnerFindByAllAction,
  SpinnerUpdateMarkAction,
} from "./../../store/actions/SpinnerAction";
import { UserFindByUsernameAction } from "./../../store/actions/UserAction";
import Notification from "./../../common/Notification";
import {
  WheelListAction,
  WheelCreateAction,
} from "./../../store/actions/WheelAction";
import moment from "moment";
import { GroupOrderFindAllAction } from "../../store/actions/GroupOrderAction";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "90vh",
    overflow: "hidden",
    marginTop: 5,

    "& .overlay": {
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: "red",
      backgroundColor: "red",
      opacity: 0,
    },
  },
  rewardSnackbar: {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '1.2rem',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  tableContainer: {
    maxHeight: 400,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
      '&:hover': {
        background: '#555',
      },
    },
  },
}));

const Spinner = () => {
  const classes = useStyles();
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [dailySpins, setDailySpins] = useState(0);
  const [lastSpinDate, setLastSpinDate] = useState('');

  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const spinner = useSelector((state) => state.spinner);
  const { wheels } = useSelector((state) => state.wheel);
  const { customer } = useSelector((state) => state.customer);
  const [segments, setSegments] = useState([]);
  const [segColors, setSegColors] = useState([]);
  const [loading, setLoading] = useState(false);

  //support group member
  const auth = useSelector((state) => state.auth);
  const { order } = useSelector((state) => state.order);

  useEffect(() => {
    if (
      order &&
      Object.keys(order).length !== 0 &&
      order.constructor === Object
    ) {
      if (
        (!Object.is(localStorage.getItem("member", null)) &&
          !Object.is(localStorage.getItem("member"), null)) ||
        localStorage.getItem("user")
      ) {
        setTimeout(() => {
          const groupMember = JSON.parse(localStorage.getItem("groupMember"));
          const username = groupMember?.username;
          const type = "team";
          const orderID = groupMember?.orderID;
          GroupOrderFindAllAction({ username, type, orderID })(dispatch);
        }, 500);
      }

      if (auth?.user?.token) {
        setTimeout(() => {
          const username = auth?.user?.username;
          const type = "team";
          const orderID = order?.id;
          GroupOrderFindAllAction({ username, type, orderID })(dispatch);
        }, 500);
      }
    }
  }, [auth?.user?.token, auth?.user?.username, dispatch, order, order?.id]);

  useEffect(() => {
    WheelListAction()(dispatch);
    SpinnerFindByAllAction()(dispatch);
    if (user !== null) {
      dispatch(UserFindByUsernameAction(user.username));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const { spinners, isLoading } = spinner;
    const segmentsFetch = [];
    const segColorsFetch = [];
    if (Array.isArray(spinners)) {
      spinners.forEach((item) => {
        const { color, name } = item;
        segmentsFetch.push(name);
        segColorsFetch.push(color);
      });
    }

    setSegments(segmentsFetch);
    setSegColors(segColorsFetch);
    setLoading(isLoading);
  }, [spinner]);

  // Add log to check wheels data
  useEffect(() => {
    console.log('Wheels data:', wheels);
    console.log('Number of wheels:', wheels?.length);
  }, [wheels]);

  const onFinished = (winner) => {
    setIsSpinning(false);
    
    if (Object.is(winner, "May mắn lần sau")) {
      SpinnerUpdateMarkAction({
        id: user.id,
        username: user.username,
      })(dispatch)
      .then(response => {
        if (response?.error) {
          Notification.error(response.error);
          return;
        }
        setRewardMessage("Chúc bạn may mắn lần sau!");
        setShowReward(true);
      })
      .catch(error => {
        Notification.error(error.message || "Có lỗi xảy ra!");
      });
      return;
    }

    if (Object.is(winner, "Mã đổi điểm")) {
      WheelCreateAction({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        reward: "Nhận được mã đổi điểm",
        type: "voucher",
        mark: Math.floor(Math.random() * 10000) + 1,
      })(dispatch)
      .then(response => {
        if (response?.error) {
          Notification.error(response.error);
          return;
        }
        setRewardMessage("Chúc mừng! Bạn đã nhận được một mã đổi điểm!");
        setShowReward(true);
      })
      .catch(error => {
        Notification.error(error.message || "Có lỗi xảy ra!");
      });
    } else if (!Object.is(winner, "voucher")) {
      WheelCreateAction({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        reward: `Nhận được ${winner} điểm`,
        type: "mark",
        mark: winner,
      })(dispatch)
      .then(response => {
        if (response?.error) {
          Notification.error(response.error);
          return;
        }
        setRewardMessage(`Chúc mừng! Bạn đã nhận được ${winner} điểm!`);
        setShowReward(true);
      })
      .catch(error => {
        Notification.error(error.message || "Có lỗi xảy ra!");
      });
    }
  };

  const handleCloseReward = () => {
    setShowReward(false);
  };

  const handleSpin = () => {
    setIsSpinning(true);
  };

  const handleCheckLogin = () => {
    if (!user?.token || user?.roles?.includes("ROLE_ADMIN")) {
      history.push("/signin");
      return;
    }

    // Check if it's a new day
    const today = new Date().toDateString();
    if (lastSpinDate !== today) {
      setDailySpins(0);
      setLastSpinDate(today);
    }

    // Check daily spin limit
    if (dailySpins >= 5) {
      Notification.error("Bạn đã hết lượt quay trong ngày hôm nay!");
      return;
    }

    if (!customer?.memberVip || customer?.memberVip?.mark < 500) {
      Notification.error("Số điểm của bạn không đủ để quay!");
      return;
    }

    // Increment daily spins
    setDailySpins(prev => prev + 1);
    handleSpin();
  };

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid
        item
        sm={6}
        md={6}
        lg={6}
        style={{ position: "relative", zIndex: 2, cursor: "pointer" }}
      >
        {customer?.memberVip?.mark > 500 ? (
          <div></div>
        ) : (
          <div className="overlay" onClick={() => handleCheckLogin()}></div>
        )}
        {loading && (
          <WheelComponent
            refs={true}
            segments={segments}
            segColors={segColors}
            onFinished={(winner) => onFinished(winner)}
            primaryColor="black"
            contrastColor="white"
            buttonText="Spin"
            isOnlyOnce={false}
            size={250}
            upDuration={100}
            downDuration={1000}
            onSpin={handleSpin}
          />
        )}
      </Grid>

      <Grid
        item
        sm={6}
        md={6}
        lg={6}
        style={{ position: "relative", zIndex: 3 }}
      >
        <Grid item md={12}>
          <Typography component="h6" variant="h6" style={{ color: "#006E4E" }}>
            Thể lệ (500 điểm/lần)
          </Typography>
          <Typography component="p">
            <DoneIcon style={{ color: "red" }} />
            Tham gia vòng quay thưởng miễn phí 100% trúng thưởng.
          </Typography>
          <Typography component="p">
            <DoneIcon style={{ color: "red" }} />
            Sử dụng điểm để tham gia quay thưởng.
          </Typography>
          <Typography component="p">
            <DoneIcon style={{ color: "red" }} />
            Không yêu cầu thông tin cá nhân, chỉ cần có tài khoản.
          </Typography>
          <Typography component="p">
            <DoneIcon style={{ color: "red" }} />
            Đăng ký ngay để tham gia vòng quay miễn phí.
          </Typography>
          <Typography component="p">
            <DoneIcon style={{ color: "red" }} />
            Hãy đổi điểm bằng mã trong trang quản lý mã để tích được nhiều điểm hơn.
          </Typography>
        </Grid>
        <Grid item md={12}>
          <Typography
            component="p"
            variant="h4"
            style={{ textAlign: "center", margin: 10, paddingTop: 5 }}
          >
            LƯỢT QUAY GẦN ĐÂY
          </Typography>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Tài khoản</TableCell>
                  <TableCell>Giải thưởng</TableCell>
                  <TableCell>Thời gian</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wheels &&
                  wheels.slice(0, 10).map((w, index) => (
                    <TableRow key={index}>
                      <TableCell>{w.fullName}</TableCell>
                      <TableCell>{w.reward}</TableCell>
                      <TableCell>
                        {moment(w.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Snackbar
        open={showReward}
        autoHideDuration={3000}
        onClose={handleCloseReward}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div className={classes.rewardSnackbar}>
          {rewardMessage}
        </div>
      </Snackbar>
    </Grid>
  );
};

export default Spinner;
