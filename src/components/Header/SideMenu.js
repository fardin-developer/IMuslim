import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import HistoryIcon from "@mui/icons-material/History";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import ModeIcon from "@mui/icons-material/Mode";
import IMAGES from "../../img/image";
import { setUser } from "../../redux/features/userSlice";
import "./SideMenu.css";

const SideMenu = ({ sideMenu, setSideMenu }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure to Logout?");
    if (confirmLogout) {
      localStorage.clear("token");
      message.success("Logout Successful");
      dispatch(setUser(null));
      navigate("/login");
    }
  };
  return (
    <div
      className={`sidemenu-container ${sideMenu ? "active" : ""
        }`}
    >
      <div className="sidemenu">
        <div className="logo">
          <img src={IMAGES.logo} alt="" />
          <HighlightOffIcon
            onClick={() => setSideMenu(!sideMenu)}
            className="icon"
          />
        </div>
        <div className="islamic-divider"></div>
        <ul className="p-0 ul">
          <>
            <li>
              <Link onClick={() => setSideMenu(!sideMenu)} to="/">
                <HomeIcon className="icon me-2 menuicon" />
                Home
              </Link>
            </li>


            <li>
              <Link onClick={() => setSideMenu(!sideMenu)} to="/orders">
                <HistoryIcon className="icon me-2 menuicon" />
                Order History
              </Link>
            </li>
          </>
          {user && (
            <li>
              <Link to="/user-dashboard">
                <AccountBoxIcon className="icon me-2 menuicon" />
                My Account
              </Link>
            </li>
          )}
          <li>
            <Link to="https://wa.me/9401410882" target="_blank">
              <WhatsAppIcon className="icon me-2 menuicon" />
              24/7 Chat Support
            </Link>
          </li>
          <div className="islamic-divider"></div>
          {!user && (
            <>
              <button
                className="signin"
                onClick={() => {
                  navigate("/login");
                  setSideMenu(!sideMenu);
                }}
              >
                Sign In
              </button>
              <button
                className="signin mt-2"
                onClick={() => {
                  navigate("/register");
                  setSideMenu(!sideMenu);
                }}
              >
                Sign Up Its Free
              </button>
            </>
          )}
          {user && (
            <li className="logout" onClick={handleLogout}>
              <LogoutIcon className="icon" />
              Logout
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
