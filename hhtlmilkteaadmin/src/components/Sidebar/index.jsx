import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CategoryIcon from "@material-ui/icons/Category";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import PeopleIcon from "@material-ui/icons/People";
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const Sidebar = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isShipper = user?.roles?.includes("ROLE_SHIPPER");

    const menuItems = [
        {
            path: "/admin/dashboard",
            icon: <DashboardIcon />,
            name: "Dashboard",
            show: true
        },
        {
            path: "/admin/product",
            icon: <FastfoodIcon />,
            name: "Sản phẩm",
            show: isAdmin
        },
        {
            path: "/admin/category",
            icon: <CategoryIcon />,
            name: "Danh mục",
            show: isAdmin
        },
        {
            path: "/admin/order",
            icon: <LocalShippingOutlinedIcon />,
            name: "Đơn hàng",
            show: isAdmin
        },
        {
            path: "/admin/user",
            icon: <PeopleIcon />,
            name: "Người dùng",
            show: isAdmin
        },
        {
            path: "/admin/shipper",
            icon: <LocalShippingOutlinedIcon />,
            name: "Giao hàng",
            show: isShipper
        }
    ];

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
        >
            {menuItems.map((item) => (
                item.show && (
                    <ListItem
                        button
                        key={item.path}
                        onClick={() => history.push(item.path)}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                )
            ))}
        </List>
    );
};

export default Sidebar; 