import React, { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import { setQuery } from "../../redux/features/querySlice";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.query);
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    dispatch(setUser(null));
    navigate("/login");
  };

  const getQueryStatus = useCallback(async () => {
    try {
      // Query API not available in new API structure
      // Set query status to true (no new queries) for now
      dispatch(setQuery(true));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      getQueryStatus();
    }
  }, [user, getQueryStatus]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu d-none d-lg-block">
        <h4>Menu</h4>
        <hr />
        <ul>
          <li
            onClick={() => navigate("/user-dashboard")}
            className={`${location.pathname === "/user-dashboard" && "active"}`}
          >
            Dashboard
          </li>
          <li
            onClick={() => navigate("/wallet")}
            className={`${location.pathname === "/wallet" && "active"}`}
          >
            Wallet
          </li>
          <li
            onClick={() => navigate("/orders")}
            className={`${location.pathname === "/orders" && "active"}`}
          >
            Orders
          </li>
          <li
            onClick={() => navigate("/payments")}
            className={`${location.pathname === "/payments" && "active"}`}
          >
            Payments
          </li>
          <li
            onClick={() => navigate("/my-account")}
            className={`${location.pathname === "/my-account" && "active"}`}
          >
            Account
          </li>
          <li
            onClick={() => navigate("/query")}
            className={`tp ${location.pathname === "/query" && "active"}`}
          >
            Queries
            {!query && <span>new</span>}
          </li>
          <li style={{ cursor: "pointer" }} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default DashboardLayout;
