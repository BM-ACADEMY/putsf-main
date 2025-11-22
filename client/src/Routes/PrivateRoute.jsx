// src/Routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = () => {
  const location = useLocation();

  return isAuthenticated() ? (
    <Outlet />
  ) : (
    // Redirect to login and keep the original destination
    <Navigate
      to="/admin/login"
      replace
      state={{ from: location }}   // optional – you can read it after login
    />
  );
};

export default PrivateRoute;