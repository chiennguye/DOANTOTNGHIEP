import Dashboard from "../components/Dashboard";
import Product from "../components/Product";
import Category from "../components/Category";
import Order from "../components/Order";
import User from "../components/User";
import Shipper from "../components/Shipper";

const routes = [
    {
        path: "/dashboard",
        component: Dashboard,
        layout: "/admin"
    },
    {
        path: "/product",
        component: Product,
        layout: "/admin"
    },
    {
        path: "/category",
        component: Category,
        layout: "/admin"
    },
    {
        path: "/order",
        component: Order,
        layout: "/admin"
    },
    {
        path: "/user",
        component: User,
        layout: "/admin"
    },
    {
        path: "/shipper",
        component: Shipper,
        layout: "/admin"
    }
];

export default routes; 