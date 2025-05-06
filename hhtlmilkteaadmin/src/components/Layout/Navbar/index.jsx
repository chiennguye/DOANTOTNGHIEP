import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Avatar,
  IconButton,
  makeStyles,
  MenuItem,
  Typography,
  Menu,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Drawer,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MainListItems from "../ListItem";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AuthLogoutAction } from "../../../store/actions/AuthAction";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Logo from "./../../../assets/img/logo.png";
import { Client } from "@stomp/stompjs";
import { RatingListAction } from "../../../store/actions/RatingAction";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import api from "../../../common/APIClient";

const SOCKET_URL = "ws://localhost:8080/ws";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorElLogout, setAnchorElLogout] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    dispatch(RatingListAction());
    // Fetch unread notifications on login
    fetchUnreadNotifications();
  }, [dispatch]);

  const fetchUnreadNotifications = async () => {
    try {
      console.log('Fetching unread notifications...');
      const response = await api.get('/notifications/unread', {
        params: {
          role: 'ADMIN'
        }
      });
      console.log('Unread notifications response:', response.data);
      const unreadNotifications = response.data;
      setNotifications(unreadNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);
      await api.put(`/notifications/${notificationId}/read`);
      // Update local state to remove the read notification
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    let onConnected = () => {
      console.log("WebSocket Connected Successfully!");
      client.subscribe("/topic/notifications", function (msg) {
        console.log("Received WebSocket message:", msg);
        if (msg.body) {
          try {
            const notification = JSON.parse(msg.body);
            console.log("Parsed notification:", notification);
            // Only add notification if it's for ADMIN role
            if (notification.recipientRole === 'ADMIN') {
              setNotifications(prev => [notification, ...prev]);
              setUnreadCount(prev => prev + 1);
            }
          } catch (error) {
            console.error("Error parsing notification:", error);
          }
        }
      });
    };

    let onDisconnected = () => {
      console.log("WebSocket Disconnected!");
    };

    let onStompError = (frame) => {
      console.error("WebSocket Error:", frame);
    };

    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: onConnected,
      onDisconnect: onDisconnected,
      onStompError: onStompError,
      debug: function (str) {
        console.log("STOMP Debug:", str);
      }
    });

    try {
      console.log("Attempting to connect to WebSocket...");
      client.activate();
    } catch (error) {
      console.error("Error activating WebSocket client:", error);
    }

    // Cleanup on unmount
    return () => {
      if (client) {
        console.log("Deactivating WebSocket client...");
        client.deactivate();
      }
    };
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
    // Mark all visible notifications as read when opening the menu
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return <ShoppingCartIcon />;
      case 'shipping':
        return <LocalShippingIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification) => {
    return notification.message;
  };

  function handleClickLogout(event) {
    if (anchorElLogout !== event.currentTarget) {
      setAnchorElLogout(event.currentTarget);
    }
  }

  function handleCloseLogout() {
    setAnchorElLogout(null);
  }

  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
  }));

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onHandleLogout = () => {
    dispatch(AuthLogoutAction());
    history.push("/login");
  };

  return (
    <>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
             Drip&Chill
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorElNotification}
            open={Boolean(anchorElNotification)}
            onClose={handleNotificationClose}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: 300,
              },
            }}
          >
            <List>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Không có thông báo mới" />
                </ListItem>
              ) : (
                notifications.map((notification, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={getNotificationText(notification)}
                        secondary={new Date(notification.timestamp).toLocaleString()}
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainListItems />
          {open ? (
            <>
              <div
                style={{
                  display: "flex",
                  position: "fixed",
                  bottom: 0,
                  paddingTop: 10,
                  paddingLeft: 10,
                  paddingBottom: 10,
                  cursor: "pointer",
                }}
                onClick={handleClickLogout}
              >
                <Avatar alt="Avatar Admin" src={Logo} />
                <Typography style={{ marginLeft: 20, marginTop: 10 }}>
                  {auth.user.fullName}
                </Typography>
                <ExpandLessIcon style={{ marginTop: 10, marginLeft: 10 }} />
              </div>
              <Menu
                id="simple-menu"
                anchorEl={anchorElLogout}
                open={Boolean(anchorElLogout)}
                onClose={handleCloseLogout}
                MenuListProps={{ onMouseLeave: handleCloseLogout }}
                style={{ marginTop: -40, marginLeft: 150 }}
              >
                <MenuItem
                  onClick={onHandleLogout}
                  style={{ backgroundColor: "white" }}
                >
                  <Typography>Đăng xuất</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Avatar
              alt="Avatar Admin"
              src={Logo}
              style={{
                position: "fixed",
                bottom: 0,
                marginLeft: 14,
                marginBottom: 10,
              }}
            />
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
