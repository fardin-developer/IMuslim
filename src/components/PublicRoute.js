import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  if (localStorage.getItem("token") || localStorage.getItem("authToken")) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}
