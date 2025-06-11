import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, CssBaseline, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Add, DeleteOutline, Remove } from "@material-ui/icons";
import {
  OrderDelteOrderDetail,
  OrderUpdateQuantity,
} from "../../store/actions/OrderAction";
import { GroupOrderFindAllAction } from "../../store/actions/GroupOrderAction";
import Notification from "../../common/Notification";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
  },
  table: {
    minWidth: 700,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
    },
  },
  layout: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  paper: {
    minHeight: 400,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: 15,
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
    '&::-webkit-scrollbar': {
      height: '8px',
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
  btnCount: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    paddingTop: 14,
    color: '#3250a8',
    '&:hover': {
      color: '#1a237e',
    },
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    borderRadius: 25,
    padding: '10px 30px',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
    },
  },
  productImage: {
    width: 100,
    height: 'auto',
    borderRadius: 10,
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
      width: 60,
    },
  },
  productName: {
    fontWeight: 500,
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },
  tableCell: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 600,
      color: '#333',
    },
  },
  deleteIcon: {
    color: '#d32f2f',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  totalRow: {
    backgroundColor: '#f8f9fa',
    '& td': {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
  },
  emptyCart: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: '#666',
  },
  title: {
    color: '#1a237e',
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
}));

const ShoppingCart = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { order, totalPrice } = useSelector((state) => state.order);
  const auth = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);

  //support group member

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

  const checkStoreHours = () => {
    const now = new Date();
     const testHour = 7;
     const currentHour = testHour || now.getHours();
    return currentHour >= 6 && currentHour < 23;
  };

  const onHandleRedirectCheckout = () => {
    if (!checkStoreHours()) {
      setOpenDialog(true);
      return;
    }

    // Check if any product quantity exceeds inventory
    const hasExceededInventory = order?.orderDetails?.some(
      item => item.quantity > item.product.inventory?.quantity
    );

    if (hasExceededInventory) {
      Notification.error("Một số sản phẩm trong giỏ hàng vượt quá số lượng trong kho!");
      return;
    }

    window.location.href = "/checkout";
    localStorage.setItem("map", "refresh");
    localStorage.removeItem("group");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onHandleUpdateQuantity = (orderDetailId, action) => {
    const username = auth?.user?.username;
    const type = "team";
    const orderID = order?.id;
    
    // Find the order detail to check inventory
    const orderDetail = order?.orderDetails?.find(item => item.id === orderDetailId);
    if (!orderDetail) return;

    // Check if increasing quantity would exceed inventory
    if (action === "plus" && orderDetail.quantity >= orderDetail.product.inventory?.quantity) {
      Notification.error("Số lượng sản phẩm vượt quá số lượng trong kho!");
      return;
    }

    dispatch(
      OrderUpdateQuantity(
        { orderDetailId, action },
        { username, type, orderID }
      )
    );
  };

  const onHandleDeleteOrderDetail = (id) => {
    const username = auth?.user?.username;
    const type = "team";
    const orderID = order?.id;
    dispatch(OrderDelteOrderDetail(id, { username, type, orderID }));
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.mainContent}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center" className={classes.title}>
              Giỏ hàng
            </Typography>

            <React.Fragment>
              <Grid container spacing={3} style={{ marginTop: 10 }}>
                <Grid item xs={12}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} aria-label="spanning table">
                      <TableHead className={classes.tableHeader}>
                        <TableRow>
                          <TableCell align="center">
                            <b>Hình ảnh</b>
                          </TableCell>
                          <TableCell>
                            <b>Sản phẩm</b>
                          </TableCell>
                          <TableCell align="left">
                            <b>Số lượng</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>Giá</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>Tổng</b>
                          </TableCell>
                          <TableCell align="center"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order?.orderDetails?.length > 0 ? (
                          order?.orderDetails?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell align="center" className={classes.tableCell}>
                                <img
                                  alt={item.product.name}
                                  src={item.product.linkImage}
                                  className={classes.productImage}
                                />
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                <p className={classes.productName}>{item.product.name}</p>
                                <span style={{ fontSize: 12, color: "#d32f2f" }}>
                                  {item.sizeOptionId}{" "}
                                  {item.addOptionId !== "" && ": " + item.addOptionId}
                                </span>
                              </TableCell>
                              <TableCell align="center" className={classes.tableCell}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    className={classes.btnCount}
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        onHandleUpdateQuantity(item.id, "minus");
                                      }
                                    }}
                                  >
                                    <Remove />
                                  </div>
                                  <p
                                    style={{
                                      fontSize: 16,
                                      fontWeight: 500,
                                    }}
                                    translate="no"
                                  >
                                    {item.quantity}
                                  </p>
                                  <div
                                    className={classes.btnCount}
                                    onClick={() => {
                                      onHandleUpdateQuantity(item.id, "plus");
                                    }}
                                  >
                                    <Add />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell align="center" className={classes.tableCell}>
                                {item.priceCurrent.toLocaleString("it-IT", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </TableCell>
                              <TableCell align="center" className={classes.tableCell}>
                                {(item.priceCurrent * item.quantity).toLocaleString("it-IT", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </TableCell>
                              <TableCell align="center" className={classes.tableCell}>
                                <DeleteOutline
                                  className={classes.deleteIcon}
                                  onClick={() => {
                                    onHandleDeleteOrderDetail(item.id);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className={classes.emptyCart}>
                              <Typography variant="h6" style={{ color: '#666' }}>
                                Không có sản phẩm trong giỏ hàng
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}

                        <TableRow className={classes.totalRow}>
                          <TableCell colSpan={5}>
                            <b>Tổng tiền thanh toán</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>
                              {totalPrice.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onHandleRedirectCheckout}
                    disabled={order?.orderDetails?.length > 0 ? false : true}
                  >
                    Đặt hàng
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          </Paper>
        </main>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: "#d32f2f" }}>
          Thông báo
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ fontSize: '16px' }}>
            Quán chúng tôi hiện chưa mở cửa. Chúng tôi chỉ phục vụ từ 6h-23h hàng ngày. Mong quý khách hàng thông cảm !!!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Đã hiểu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShoppingCart;
