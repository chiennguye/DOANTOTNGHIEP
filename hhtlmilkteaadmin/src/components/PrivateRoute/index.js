import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const DefaultLayout = React.lazy(() => import("./../Layout/DefaultLayout"));

const PrivateRoute = ({ children, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Route
      {...rest}
      render={() => {
        // Kiểm tra cả auth.user và localStorage
        if (auth.user || user) {
          const currentUser = auth.user || user;
          // Kiểm tra token
          if (currentUser.token) {
            return <DefaultLayout>{children}</DefaultLayout>;
          }
        }
        // Nếu không có quyền truy cập, chuyển về trang login
        return <Redirect to="/login" />;
      }}
    />
  );
};

export default PrivateRoute;
