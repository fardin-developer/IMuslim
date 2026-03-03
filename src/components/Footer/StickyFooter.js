import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WalletIcon from "@mui/icons-material/Wallet";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import "./StickyFooter.css";

const StickyFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [menu, setMenu] = useState(false);

  function handleMenu() {
    setMenu(!menu);
  }

  function handleClose(e) {
    e.stopPropagation();
    setMenu(!menu);
  }

  function handleLogout() {
    dispatch(setUser(null));
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="sticky-footer d-block d-lg-none">
      <div className="footer-tabs">
        <div
          onClick={() => navigate("/")}
          className={`footer-icon ${location.pathname === "/" && "active"}`}
        >
          <HomeIcon className="icon" />
          <span>Home</span>
        </div>
        {user && (
          <div
            onClick={() => navigate("/user-dashboard")}
            className={`footer-icon ${
              location.pathname === "/user-dashboard" && "active"
            }`}
          >
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </div>
        )}
        {user && (
          <div
            onClick={() => navigate("/wallet")}
            className={`footer-icon ${
              location.pathname === "/wallet" && "active"
            }`}
          >
            <WalletIcon className="icon" />
            <span>Wallet</span>
          </div>
        )}

        <div
          onClick={() => navigate("/orders")}
          className={`footer-icon ${
            location.pathname === "/orders" && "active"
          }`}
        >
          <ShoppingBagIcon className="icon" />
          <span>Orders</span>
        </div>


        {!user && (
          <div
            onClick={() => navigate("/login")}
            className={`footer-icon ${
              location.pathname === "/login" && "active"
            }`}
          >
            <LoginIcon className="icon" />
            <span>Login</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyFooter;
