import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideMenu from "./SideMenu";
import Backdrop from "./Backdrop";
import Tippy from "@tippyjs/react";
import LogoutTippy from "./LogoutTippy";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "./Header.css";
import IMAGES from "../../img/image.js";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const { balance } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sideMenu, setSideMenu] = useState(false);
  const [black, setBlack] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 40) {
        setBlack(true);
      } else {
        setBlack(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check if we're on login or register page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/otp";

  // Handle user icon click - navigate directly on auth pages, show tippy otherwise
  const handleUserIconClick = (e) => {
    if (isAuthPage) {
      e.stopPropagation();
      navigate(user ? "/my-account" : "/login");
    }
  };

  return (
    <>
      {/* Desktop Header - hidden to use unified mobile header on all viewports */}
      <header className="header d-none">
        <div className="header-main">
          <div
            className="burger-icon header-left"
            onClick={() => setSideMenu(!sideMenu)}
          >
            <MenuIcon className="icon" />
          </div>
          <div className="logo header-center" onClick={() => navigate("/")}>
            <img src={IMAGES.logo} alt="Logo" />
          </div>
          <div className="action-btns header-right">
            {user && (
              <div
                onClick={() => navigate("/wallet")}
                className="wallet-cont header-coin-btn"
              >
                <img width="20px" height="20px" src={IMAGES.coin} alt="Coin" />
                <span>{parseFloat(balance).toFixed(2)}</span>
              </div>
            )}
            {/* Conditionally render Tippy based on page */}
            {!isAuthPage ? (
              <Tippy
                interactive
                theme="light"
                content={<LogoutTippy user={user && user} />}
              >
                <span
                  className="menu-img-container d-flex header-user-icon"
                  style={{ cursor: "pointer" }}
                >
                  <AccountCircleIcon
                    className="icon"
                    style={{ fontSize: "32px", color: "#967563" }}
                  />
                </span>
              </Tippy>
            ) : (
              <span
                className="menu-img-container d-flex header-user-icon"
                onClick={handleUserIconClick}
                style={{ cursor: "pointer" }}
              >
                <AccountCircleIcon
                  className="icon"
                  style={{ fontSize: "32px", color: "#967563" }}
                />
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className={`mobile-header ${black && "active"}`}>
        <div
          className="burger-icon mobile-header-left"
          onClick={() => setSideMenu(!sideMenu)}
        >
          <MenuIcon className="icon" />
        </div>
        <div className="logo mobile-header-center" onClick={() => navigate("/")}>
          <img src={IMAGES.logo} alt="Logo" />
        </div>
        <div className="mobile-header-right">
          {/* Conditionally render Tippy based on page */}
          {!isAuthPage ? (
            <Tippy
              interactive
              theme="light"
              content={<LogoutTippy user={user && user} />}
            >
              <span
                className="menu-img-container d-flex mobile-header-user-icon"
                style={{ cursor: "pointer" }}
              >
                <AccountCircleIcon
                  className="icon"
                  style={{ fontSize: "28px", color: "#967563" }}
                />
              </span>
            </Tippy>
          ) : (
            <span
              className="menu-img-container d-flex mobile-header-user-icon"
              onClick={handleUserIconClick}
              style={{ cursor: "pointer" }}
            >
              <AccountCircleIcon
                className="icon"
                style={{ fontSize: "28px", color: "#967563" }}
              />
            </span>
          )}
        </div>
      </div>

      {/* Side Menu and Backdrop - Only one instance */}
      <SideMenu sideMenu={sideMenu} setSideMenu={setSideMenu} />
      <Backdrop sideMenu={sideMenu} setSideMenu={setSideMenu} />
    </>
  );
};

export default Header;
