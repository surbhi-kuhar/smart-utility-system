// src/components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!Cookies.get("token"); // Check if the token exists

  return isAuthenticated ? children : <Navigate to="/error" />;
};

export default ProtectedRoute;
