import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import {
  AppBar,
  Avatar,
  Badge,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  useTheme,
  withStyles,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import logo from "./../../../assets/img/logo.png";
import delivery from "./../../../assets/img/delivery.png";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthLogoutAction } from "./../../../store/actions/AuthAction";
import { UserFindByUsernameAction } from "./../../../store/actions/UserAction";
import {
  OrderDelteOrderDetail,
  OrderFindAction,
  OrderUpdateQuantity,
} from "../../../store/actions/OrderAction";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Notification from "../../../common/Notification";
import ClearIcon from "@material-ui/icons/Clear";
import { Add, DeleteOutline, Remove } from "@material-ui/icons";
import {
  GroupOrderFindAllAction,
  GroupOrderShortURL,
  GroupOrderDeleteMember,
  GroupOrderDeleteGroupMembersAction,
  GroupOrderUpdateQuantity,
  GroupOrderDetailsDelete,
} from "./../../../store/actions/GroupOrderAction";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import { getRatings } from "../../../store/actions/RatingAction";

const sections = [
  { title: "TRANG CHỦ", url: "/home" },
  { title: "ĐỒ UỐNG PHA CHẾ", url: "/milktea" },
  { title: "ĐỒ ĂN NHÂM NHI", url: "/dessert" },
  { title: "SẢN PHẨM", url: "/product" },
  { title: "VÒNG QUAY MAY MẮN", url: "/spinner" },
  { title: "VỀ CHÚNG TÔI", url: "/about" },
];

const drawerWidth = 500;

function getModalStyle() {
  const top = 30;
  const left = 40;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: "space-between",
  },
  paper: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  toolbarTitle: {
    flex: 2,
    color: "#2e9e53",
    fontWeight: "bold",
  },
  toolbarSecondary: {
    justifyContent: "center",
    overflowX: "auto",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  toolbarLink: {
    paddingRight: theme.spacing(2),
    flexShrink: 0,
    fontSize: 16 + "px",
    marginRight: 24 + "px",
    color: "#444a46",
    fontWeight: "bold",
    "&:hover": {
      color: "#416c48",
    },
  },
  btnResponsive: {
    cursor: "pointer",
    color: "#444a46",
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: "flex",
    },
  },
  navbarLeft: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  title: {
    color: "red",
    fontSize: 14,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  btnCount: {
    background: "none",
    border: "none",
    cursor: "pointer",
    paddingTop: 14,
    color: "#3250a8",
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    marginRight: 8,
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Header = ({ isOpen, onHandleOpen }) => {
  const history = useHistory();
  const classes = useStyles();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [left, setLeft] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const [anchorElAccount, setAnchorElAccount] = useState(null);

  const { customer, wishlist } = useSelector((state) => state.customer);
  const { order, quantity } = useSelector((state) => state.order);
  const { shortUrl } = useSelector((state) => state.groupOrder);
  const { dataGroupOrderDetails } = useSelector((state) => state.groupOrder);

  const [open, setOpen] = React.useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [shortUrlRes, setShortUrlRes] = useState("");
  const [copy, setCopy] = useState("Sao chép");

  const { search } = window.location;

  useEffect(() => {
    dispatch(getRatings())
  }, [dispatch])

  const handleOpenModal = () => {
    let longUrl = `http://${window.location.host}?username=${auth?.user?.username}&type=team&orderID=${order?.id}`;
    if (
      !Object.is(localStorage.getItem("member"), null) &&
      !Object.is(localStorage.getItem("groupMember"), null)
    ) {
      const groupMember = JSON.parse(localStorage.getItem("groupMember"));

      longUrl = `http://${window.location.host}?username=${groupMember?.username}&type=team&orderID=${groupMember?.orderID}`;
    }

    GroupOrderShortURL({ longUrl })(dispatch).then((res) => {
      setShortUrlRes(`http://${res.shortUrl}`);
      setCopy("Sao chép");
      setOpenModal(true);
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const setParams = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (
            new URLSearchParams(search).get("username") &&
            new URLSearchParams(search).get("type") &&
            new URLSearchParams(search).get("orderID") &&
            Object.is(localStorage.getItem("user"), null)
          ) {
            const username = new URLSearchParams(search).get("username");
            const type = "team";
            const orderID = new URLSearchParams(search).get("orderID");
            GroupOrderFindAllAction({ username, type, orderID })(dispatch);
            resolve(
              localStorage.setItem(
                "groupMember",
                JSON.stringify({
                  username: username,
                  type: type,
                  orderID: orderID,
                })
              )
            );
          } else {
            resolve();
          }
        }, 500);
      });
    };

    setParams();

    return () => setParams();
  }, [dispatch, history, search]);

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("member")) {
        const groupMember = JSON.parse(localStorage.getItem("groupMember"));
        const username = groupMember?.username;
        const type = "team";
        const orderID = groupMember?.orderID;
        GroupOrderFindAllAction({ username, type, orderID })(dispatch);
      }
    }, 500);
  }, [auth.token, auth?.user?.username, dispatch]);

  useEffect(() => {
    setOpen(isOpen);
    if (auth?.user?.token) {
      dispatch(UserFindByUsernameAction(auth.user.username));
      dispatch(OrderFindAction(auth.user.id));
    }
  }, [auth, dispatch, isOpen]);

  // Cehck member in list
  useEffect(() => {
    const member = localStorage.getItem("member");

    if (member) {
      let flag = true;
      if (dataGroupOrderDetails?.groupOrderInfoResponses?.length > 0) {
        for (
          let i = 0;
          i < dataGroupOrderDetails?.groupOrderInfoResponses?.length;
          i++
        ) {
          if (
            dataGroupOrderDetails?.groupOrderInfoResponses[i]?.username ===
            member
          ) {
            flag = false;
            return;
          }
        }
      }

      if (localStorage.getItem("user")) {
        flag = false;
      }

      if (flag) {
        setOpen(false);
        onHandleOpen(false);
      }
    }
  }, [
    dataGroupOrderDetails?.groupOrderInfoResponses,
    dataGroupOrderDetails?.groupOrderInfoResponses?.length,
    dispatch,
    onHandleOpen,
  ]);

  function handleClick(event) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClickSearch(event) {
    if (anchorElSearch !== event.currentTarget) {
      setAnchorElSearch(event.currentTarget);
    }
  }

  function handleCloseSearch() {
    setAnchorElSearch(null);
  }

  function handleClickAccount(event) {
    if (anchorElAccount !== event.currentTarget) {
      setAnchorElAccount(event.currentTarget);
    }
  }

  function handleCloseAccount() {
    setAnchorElAccount(null);
  }

  const toggleDrawer = () => () => {
    setLeft(!left);
  };

  const onHandelRedirectCart = () => {
    if (auth?.user?.token) {
      history.push("/shoppingcart");
    }
  };

  const onHandleLogout = () => {
    AuthLogoutAction()(dispatch).then((res) => {
      setAnchorElAccount(null);
      history.push("/home");
    });
  };

  const onHandleFavorite = () => {
    if (auth?.user?.token) {
      history.push("/wishlist");
    } else {
      Notification.error("Vui lòng đăng nhập !");
    }
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(left, false)}
      onKeyDown={toggleDrawer(left, false)}
    >
      <List style={{ width: 200 + "px" }}>
        {sections.map((text) => (
          <Link
            to={text.url}
            style={{ textDecoration: "none" }}
            key={text.title}
          >
            <ListItem button>
              <ListItemText primary={text.title} style={{ color: "black" }} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  const handleInvite = () => {
    navigator.clipboard.writeText(shortUrlRes);
    setCopy("Đã sao chép");
  };

  const modal = (
    <div style={modalStyle} className={classes.paper}>
      <h4 id="simple-modal-title">ĐƯỜNG DẪN CHIA SẼ</h4>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          disabled
          id="standard-disabled"
          style={{ width: 300 }}
          defaultValue={shortUrlRes}
        />
        <Button
          variant="contained"
          style={{ width: 130, height: 33 }}
          onClick={handleInvite}
        >
          {copy}
        </Button>
      </div>
    </div>
  );

  const handleDrawerCloseGroup = () => {
    setOpen(false);
    onHandleOpen(false);
  };

  const onHandleUpdateQuantity = (orderDetailId, action) => {
    if (auth?.user?.token) {
      const username = auth?.user?.username;
      const type = "team";
      const orderID = order?.id;
      dispatch(
        OrderUpdateQuantity(
          { orderDetailId, action },
          { username, type, orderID }
        )
      );
    } else if (localStorage.getItem("member")) {
      const groupMember = JSON.parse(localStorage.getItem("groupMember"));
      const username = groupMember?.username;
      const orderID = groupMember?.orderID;
      const type = "team";
      dispatch(
        GroupOrderUpdateQuantity(
          { groupOrderDetailId: orderDetailId, action },
          { username, type, orderID }
        )
      );
    }
  };

  const onHandleDeleteOrderDetail = (id) => {
    if (auth?.user?.token) {
      const username = auth?.user?.username;
      const type = "team";
      const orderID = order?.id;
      dispatch(OrderDelteOrderDetail(id, { username, type, orderID }));
    } else if (localStorage.getItem("member")) {
      const groupMember = JSON.parse(localStorage.getItem("groupMember"));
      const username = groupMember?.username;
      const orderID = groupMember?.orderID;
      const type = "team";
      dispatch(GroupOrderDetailsDelete(id, { username, type, orderID }));
    }
  };

  const handleDeleteMember = (namemenber, nameOwner, orderID) => {
    const username = auth?.user?.username;
    const type = "team";
    const orderId = order?.id;
    GroupOrderDeleteMember(
      { namemenber, nameOwner, orderID },
      { username, type, orderId }
    )(dispatch);
  };

  const handleDeleteGroup = () => {
    const usernameOwner = auth?.user?.username;
    const orderIdOwner = order?.id;

    const username = auth?.user?.username;
    const type = "team";
    const orderID = order?.id;

    GroupOrderDeleteGroupMembersAction(
      { usernameOwner, orderIdOwner },
      { username, type, orderID },
      shortUrl.split("/")[2]
    )(dispatch);
  };

  const handlePayment = () => {
    window.location.href = "/checkout";
    localStorage.setItem("map", "refresh");
    localStorage.setItem("group", "payment");
  };

  return (
    <AppBar style={{ backgroundColor: "white" }}>
      <Toolbar className={classes.toolbar}>
        <MoreVertIcon
          className={classes.btnResponsive}
          onClick={toggleDrawer(true)}
        />

        <SwipeableDrawer
          anchor="left"
          open={left}
          BackdropProps={{}}
          hideBackdrop
          onClose={toggleDrawer(left, false)}
          onOpen={toggleDrawer(left, true)}
        >
          {list()}
        </SwipeableDrawer>

        <img
          src={delivery}
          alt="delivery"
          width={200}
          className={classes.navbarLeft}
        />
        <img src={logo} alt="Milktea" width={50} loading="lazy" />
        <div>
          <span translate="no">
            <Badge
              badgeContent={auth?.user?.token !== null ? quantity : 0}
              color="secondary"
              style={{ marginRight: 20 }}
            >
              <ShoppingCartIcon
                style={{ color: "#416c48", cursor: "pointer" }}
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              />
            </Badge>
          </span>
          <span translate="no">
            <Badge
              badgeContent={
                wishlist && wishlist?.quantity ? wishlist?.quantity : 0
              }
              color="secondary"
              style={{ marginRight: 20 }}
            >
              <FavoriteIcon
                style={{ color: "#416c48", cursor: "pointer" }}
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={onHandleFavorite}
              />
            </Badge>
          </span>

          <Badge style={{ position: "relative" }}>
            {/* <div id="google_translate_element"></div> */}
          </Badge>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ marginTop: 25, marginLeft: -100, width: "350" }}
          >
            <MenuItem
              style={{
                paddingLeft: 100,
                paddingRight: 100,
                color: "#416c48",
                backgroundColor: "transparent",
              }}
            >
              Giỏ hàng của bạn
            </MenuItem>
            {order?.orderDetails?.length > 0 && auth.user !== null ? (
              <MenuList style={{ overflowY: "scroll", height: 300 }}>
                {order?.orderDetails?.map((item) => (
                  <MenuItem
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      paddingLeft: 20,
                      paddingRight: 20,
                    }}
                    key={item.id}
                  >
                    <img
                      alt={item.product.name}
                      src={item.product.linkImage}
                      width={50}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ color: "#416C48" }}>
                        {item.product.name}(Số lượng: {item.quantity})
                      </span>
                      <span style={{ color: "red", fontSize: 10 }}>
                        {item.sizeOptionId}:{item.addOptionId}
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </MenuList>
            ) : (
              <MenuItem
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "red",
                  backgroundColor: "transparent",
                }}
              >
                Không có sản phẩm nào
              </MenuItem>
            )}
            <MenuItem
              style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                style={{ color: "#416c48" }}
                onClick={onHandelRedirectCart}
              >
                Xem chi tiết
              </Button>
            </MenuItem>
          </Menu>

          {auth.user !== null ? (
            !Object.is(401, auth.user.error) ? (
              !auth?.user?.roles?.includes("ROLE_ADMIN") ? (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ color: "#416c48" }}
                    onClick={handleClickAccount}
                  >
                    <div style={{ display: "flex" }}>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar
                          alt="Avatar"
                          className={classes.small}
                          src={customer?.linkImage ?? logo}
                          style={{ marginRight: 10 }}
                        />
                      </StyledBadge>
                      <div>
                        {customer && (customer.fullName ?? customer.username)}
                        <Typography className={classes.title}>
                          Điểm:{" "}
                          <span translate="no">
                            {customer && (customer?.memberVip?.mark ?? "0")}
                          </span>
                        </Typography>
                      </div>
                    </div>
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorElAccount}
                    open={Boolean(anchorElAccount)}
                    onClose={handleCloseAccount}
                    MenuListProps={{ onMouseLeave: handleCloseAccount }}
                    style={{ marginTop: 30, marginLeft: -18, width: "350" }}
                  >
                    <Link
                      to="/account"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <MenuItem>Thông tin cá nhân</MenuItem>
                    </Link>
                    <Link
                      to="/account/history"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <MenuItem>Lịch sử mua hàng</MenuItem>
                    </Link>
                    <Link
                      to="/account/voucher"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <MenuItem>Mã đổi điểm</MenuItem>
                    </Link>
                    <MenuItem onClick={onHandleLogout}>Đăng xuất</MenuItem>
                  </Menu>
                </>
              ) : (
                <Link to="/signin" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ color: "#416c48" }}
                  >
                    Đăng nhập
                  </Button>
                </Link>
              )
            ) : (
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  size="small"
                  style={{ color: "#416c48" }}
                >
                  Đăng nhập
                </Button>
              </Link>
            )
          ) : (
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                size="small"
                style={{ color: "#416c48" }}
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.toolbarSecondary}
      >
        {sections.map((section) => (
          <NavLink
            style={{ textDecoration: "none", fontFamily: "sans-serif" }}
            to={section.url}
            activeStyle={{ color: "#416c48" }}
            key={"drawler" + section.title}
            className={classes.toolbarLink}
          >
            {section.title}
          </NavLink>
        ))}
        <SearchIcon
          style={{ cursor: "pointer", color: "#444a46" }}
          aria-owns={anchorElSearch ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleClickSearch}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorElSearch}
          open={Boolean(anchorElSearch)}
          onClose={handleCloseSearch}
          MenuListProps={{ onMouseLeave: handleCloseSearch }}
          style={{ marginTop: 30, marginLeft: -120, width: "350" }}
        >
          <Link
            to="/milktea"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem>Tìm kiếm đồ uống</MenuItem>
          </Link>
          <Link
            to="/product"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem>Tìm kiếm sản phẩm</MenuItem>
          </Link>
        </Menu>
      </Toolbar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerCloseGroup}>
            {theme.direction === "rtl" ? <ClearIcon /> : <ClearIcon />}
          </IconButton>
          <Typography variant="h6" style={{ marginLeft: 100 }}>
            ĐẶT HÀNG NHÓM
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 20,
          }}
        >
          {Object.is(localStorage.getItem("member"), null) && (
            <>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginRight: 10 }}
                onClick={() => handleDeleteGroup()}
              >
                Xoá
              </Button>
            </>
          )}
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Mời bạn
          </Button>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {modal}
          </Modal>
        </div>

        <Divider style={{ marginTop: 10 }} />
        <div style={{ marginTop: 10, overflowY: "scroll", height: 550 }}>
          {dataGroupOrderDetails?.groupOrderInfoResponses &&
            dataGroupOrderDetails?.groupOrderInfoResponses?.length > 0 &&
            dataGroupOrderDetails?.groupOrderInfoResponses?.map(
              (item, index) => (
                <div key={index}>
                  {Object.is(index, 1) && (
                    <>
                      {(customer?.fullName || customer?.username) && (
                        <Typography
                          style={{
                            marginLeft: 30,
                            marginTop: 20,
                            marginBottom: 10,
                          }}
                        >
                          Bạn của {customer.fullName || customer?.username}
                        </Typography>
                      )}
                    </>
                  )}
                  <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <div style={{ display: "flex", position: "relative" }}>
                      <div style={{ marginLeft: 20 }}>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          {Object.is(index, 0) ? (
                            <Avatar
                              alt="Avatar"
                              className={classes.small}
                              src={customer?.linkImage ?? logo}
                              style={{ marginRight: 10 }}
                            />
                          ) : (
                            <Avatar
                              alt="Avatar"
                              className={classes.small}
                              src={logo}
                              style={{ marginRight: 10 }}
                            />
                          )}
                        </StyledBadge>
                      </div>
                      <Typography
                        style={{ marginLeft: 10, marginTop: 8, color: "red" }}
                      >
                        <b>{item?.username || customer?.username}</b>
                      </Typography>
                      {Object.is(localStorage.getItem("member"), null) && (
                        <>
                          {!Object.is(index, 0) && (
                            <ClearIcon
                              style={{
                                position: "absolute",
                                top: 9,
                                right: 30,
                                color: "red",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDeleteMember(
                                  item.username,
                                  auth?.user?.username,
                                  order?.id
                                )
                              }
                            />
                          )}
                        </>
                      )}
                    </div>
                    <Divider style={{ marginTop: 5 }} />

                    <div
                      style={{
                        marginTop: 10,
                        overflowY: "scroll",
                        height: 180,
                      }}
                    >
                      {item?.products?.map((product, productID) => (
                        <div
                          style={{
                            justifyContent: "space-between",
                            display: "flex",
                            backgroundColor: "transparent",
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginTop: 10,
                          }}
                          key={productID}
                        >
                          <img
                            alt={product.name}
                            src={product.linkImage}
                            width={50}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span style={{ color: "#416C48" }}>
                              {product.name}
                            </span>
                            <span style={{ color: "red", fontSize: 10 }}>
                              {item.sizeOptionIds[productID]}:
                              {item.addOptionIds[productID]}
                            </span>
                          </div>
                          <div style={{ display: "flex", marginLeft: 20 }}>
                            {Object.is(
                              customer?.fullName ||
                              localStorage.getItem("member"),
                              item.username
                            ) ? (
                              <div
                                className={classes.btnCount}
                                onClick={() => {
                                  if (item.quantities[productID] > 1) {
                                    onHandleUpdateQuantity(
                                      item.orderDetailsID[productID],
                                      "minus"
                                    );
                                  }
                                }}
                              >
                                <Remove />
                              </div>
                            ) : (
                              <div className={classes.btnCount}>
                                <Remove />
                              </div>
                            )}
                            <p
                              style={{
                                marginLeft: 20,
                                marginRight: 20,
                                fontSize: 16,
                              }}
                              translate="no"
                            >
                              {item.quantities[productID]}
                            </p>
                            {Object.is(
                              customer?.fullName ||
                              localStorage.getItem("member"),
                              item.username
                            ) ? (
                              <div
                                className={classes.btnCount}
                                onClick={() => {
                                  onHandleUpdateQuantity(
                                    item.orderDetailsID[productID],
                                    "plus"
                                  );
                                }}
                              >
                                <Add />
                              </div>
                            ) : (
                              <div className={classes.btnCount}>
                                <Add />
                              </div>
                            )}
                          </div>
                          {Object.is(
                            customer?.fullName ||
                            localStorage.getItem("member"),
                            item.username
                          ) ? (
                            <DeleteOutline
                              style={{
                                color: "red",
                                cursor: "pointer",
                                marginTop: 14,
                              }}
                              onClick={() => {
                                onHandleDeleteOrderDetail(
                                  item.orderDetailsID[productID]
                                );
                              }}
                            />
                          ) : (
                            <DeleteOutline
                              style={{
                                color: "red",
                                cursor: "pointer",
                                marginTop: 14,
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
        </div>

        {dataGroupOrderDetails && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 20,
            }}
          >
            <Typography variant="h6">Tổng tiền</Typography>
            <Typography variant="h6">
              {dataGroupOrderDetails?.totalPriceGroup?.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }) ?? 0}
            </Typography>
          </div>
        )}

        {Object.is(localStorage.getItem("member"), null) && (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            {dataGroupOrderDetails &&
              (dataGroupOrderDetails?.groupOrderInfoResponses?.length > 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handlePayment()}
                >
                  Thanh toán
                </Button>
              ) : (
                <Button variant="contained" color="primary" fullWidth disabled>
                  Thanh toán
                </Button>
              ))}
          </div>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Header;
