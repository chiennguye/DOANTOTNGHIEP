import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import { Euro } from "@material-ui/icons";
import CategoryIcon from "@material-ui/icons/Category";
import LoupeIcon from "@material-ui/icons/Loupe";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MainListItems = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Kiểm tra user có tồn tại và có roles không
  if (!user || !user.roles) {
    return null;
  }

  const isAdmin = user.roles.includes("ROLE_ADMIN");
  const isShipper = user.roles.includes("ROLE_SHIPPER");

  // Nếu là shipper, chỉ hiển thị menu đơn hàng cần giao
  if (isShipper) {
    return (
      <div>
        <Link to="/shipper" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <LocalShippingOutlinedIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Đơn hàng cần giao" />
          </ListItem>
        </Link>
      </div>
    );
  }

  // Nếu là admin, hiển thị tất cả menu
  if (isAdmin) {
    return (
      <div>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>
        </Link>
        <Link to="/order" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Đơn hàng" />
          </ListItem>
        </Link>

        <Link to="/product" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <Euro style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Sản phẩm" />
          </ListItem>
        </Link>

        <Link to="/category" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <CategoryIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Loại Sản phẩm" />
          </ListItem>
        </Link>

        <Link to="/addition" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <LoupeIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Thêm Topping" />
          </ListItem>
        </Link>

        <Link to="/sizeoption" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <LocalDrinkIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Thêm Size" />
          </ListItem>
        </Link>

        <Link to="/saleoff" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <AttachMoneyIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Sale OFF" />
          </ListItem>
        </Link>

        <Link to="/user" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Người dùng" />
          </ListItem>
        </Link>
        <Link to="/spinner" style={{ textDecoration: "none", color: "black" }}>
          <ListItem>
            <ListItemIcon>
              <CardGiftcardIcon style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary="Vòng Quay" />
          </ListItem>
        </Link>
      </div>
    );
  }

  return null;
};

export default MainListItems;
