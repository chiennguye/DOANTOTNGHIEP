import React, { useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Title from './../Title';
import { Typography, Chip, Paper, TableHead, TableContainer, Grid, Card, CardContent } from '@material-ui/core';
import { Visibility, TrendingUp, LocalShipping } from '@material-ui/icons'
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BarCode from "react-barcode";
import { LastFiveOrders, RevenueList, RevenueToday, TodayOrders } from '../../../store/actions/RevenueAction';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  wrapped: {
    "& svg": {
      width: 150,
    },
  },
  card: {
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  cardContent: {
    textAlign: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing(1),
  },
  ordersIcon: {
    color: '#2196F3',
  },
  growthIcon: {
    color: '#FF9800',
  }
}));

const Orders = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { listLastFiveOrders, revenueToday, todayOrders } = useSelector((state) => state.revenue);

  useEffect(() => {
    dispatch(LastFiveOrders());
    dispatch(RevenueList({ year: new Date().getFullYear() }));
    dispatch(RevenueToday());
    dispatch(TodayOrders());
  }, [dispatch]);

  const history = useHistory();

  // Calculate yesterday's revenue for growth rate
  const yesterdayOrders = listLastFiveOrders.filter(order => 
    moment(order.createdAt).isSame(moment().subtract(1, 'day'), 'day')
  );
  
  const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => {
    if (order.payment === 2 || order.status === 3) {
      return sum + (order.totalPrice || 0);
    }
    return sum;
  }, 0);

  // Calculate growth rate with absolute value to ensure positive percentage
  const growthRate = yesterdayRevenue ? 
    Math.abs(((revenueToday - yesterdayRevenue) / yesterdayRevenue * 100)).toFixed(2) : 0;

  // Add prefix + or - based on whether it's growth or decline
  const growthRateDisplay = yesterdayRevenue ? 
    (revenueToday > yesterdayRevenue ? '+' : '-') + growthRate : '0';

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* Orders Card */}
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <LocalShipping className={`${classes.icon} ${classes.ordersIcon}`} />
              <Typography variant="h5" component="h2">
                {todayOrders}
              </Typography>
              <Typography color="textSecondary">
                Đơn hàng hôm nay
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Card */}
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <TrendingUp className={`${classes.icon} ${classes.growthIcon}`} />
              <Typography variant="h5" component="h2">
                {revenueToday.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </Typography>
              <Typography color="textSecondary">
                Doanh thu hôm nay
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Growth Card */}
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <TrendingUp className={`${classes.icon} ${classes.growthIcon}`} />
              <Typography variant="h5" component="h2">
                {growthRateDisplay}%
              </Typography>
              <Typography color="textSecondary">
                Tăng trưởng so với hôm qua
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Title>Đơn hàng mới nhất</Title>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Số Hóa Đơn</TableCell>
              <TableCell>Ngày đặt hàng</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Chi tiết</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {listLastFiveOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row" className={classes.wrapped}>
                  <BarCode value={order.id} className={classes.barCode} />
                </TableCell>
                <TableCell>{moment(order.createdAt).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{order.userId.fullName}</TableCell>
                <TableCell>
                  {order.payment === 1 && (
                    <Typography
                      style={{ color: "black", fontWeight: 600 }}
                    >
                      Tiền mặt
                    </Typography>
                  )}
                  {order.payment === 2 && (
                    <Typography
                      style={{ color: "green", fontWeight: 600 }}
                    >
                      Trực tuyến
                    </Typography>
                  )}
                  {!order.payment && (
                    <Typography
                      style={{ color: "orange", fontWeight: 600 }}
                    >
                      Chờ thanh toán
                    </Typography>
                  )}
                </TableCell>
                <TableCell translate="no">
                  {order.totalPrice && order.totalPrice > 0 ? 
                    order.totalPrice.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) : 
                    <Typography color="orange">Chờ thanh toán</Typography>
                  }
                </TableCell>
                <TableCell>
                  {order.status === 1 &&
                    (
                      <Chip
                        label="Đang xử lý"
                        style={{ backgroundColor: "pearl", color: "white" }}
                      />
                    )}
                  {order.status === 2 &&
                    (
                      <Chip
                        label="Đang giao hàng"
                        style={{ backgroundColor: "lightblue", color: "white" }}
                      />
                    )}
                  {order.status === 3 &&
                    (
                      <Chip
                        label="Hoàn thành"
                        style={{ backgroundColor: "green", color: "white" }}
                      />
                    )}
                  {order.status === 4 && (
                    <Chip
                      label="Đã hủy"
                      style={{ backgroundColor: "red", color: "white" }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Visibility
                    style={{
                      color: "grey",
                      cursor: "pointer",
                      marginRight: 10,
                    }}
                    onClick={() => history.push("/order/detail", { order: order })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.seeMore}>
        <Link color="primary" href="/order">
          Xem thêm
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Orders;