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
    
    // Kiểm tra user có tồn tại và có roles không
    if (!user || !user.roles) {
        return null;
    }

    const isAdmin = user.roles.includes("ROLE_ADMIN");
    const isShipper = user.roles.includes("ROLE_SHIPPER");

    // Nếu không phải admin hoặc shipper thì không hiển thị menu
    if (!isAdmin && !isShipper) {
        return null;
    }

    const menuItems = isShipper ? [
        {
            path: "/shipper",
            icon: <LocalShippingOutlinedIcon />,
            name: "Đơn hàng cần giao",
            show: true
        }
    ] : [
        {
            path: "/dashboard",
            icon: <DashboardIcon />,
            name: "Dashboard",
            show: true
        },
        {
            path: "/product",
            icon: <FastfoodIcon />,
            name: "Sản phẩm",
            show: true
        },
        {
            path: "/category",
            icon: <CategoryIcon />,
            name: "Danh mục",
            show: true
        },
        {
            path: "/order",
            icon: <LocalShippingOutlinedIcon />,
            name: "Đơn hàng",
            show: true
        },
        {
            path: "/user",
            icon: <PeopleIcon />,
            name: "Người dùng",
            show: true
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