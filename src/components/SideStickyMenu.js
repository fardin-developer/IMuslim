import React, { useState } from "react";
import "./SideStickyMenu.css";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Percent as PercentIcon,
  Gamepad as GamepadIcon,
  Handshake as HandshakeIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";

const SideStickyMenu = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`side-sticky-menu ${
        isExpanded ? "expanded" : "collapsed"
      } d-none d-lg-block`}
    >
      <div className="menu-icon" onClick={toggleMenu}>
        <MenuIcon className="icon" />
      </div>
      <div className="menu-items">
        <Link to="/">
          <div className={`menu-item ${location.pathname === "/" && "active"}`}>
            <HomeIcon className="icon" />
            {isExpanded && <span>Home</span>}
          </div>
        </Link>

        {user && (
          <Link to="/user-dashboard">
            <div
              className={`menu-item ${
                location.pathname === "/user-dashboard" && "active"
              }`}
            >
              <DashboardIcon className="icon" />
              {isExpanded && <span>My Dashboard</span>}
            </div>
          </Link>
        )}
        <Link to="/promo">
          <div
            className={`menu-item ${
              location.pathname === "/promo" && "active"
            }`}
          >
            <PercentIcon className="icon" />
            {isExpanded && <span>Promo & Events</span>}
          </div>
        </Link>
        <Link to="/games">
          <div
            className={`menu-item ${
              location.pathname === "/games" && "active"
            }`}
          >
            <GamepadIcon className="icon" />
            {isExpanded && <span>Games</span>}
          </div>
        </Link>
        <hr />
        <Link to="https://wa.me/917085165780" target="_blank">
          <div className={`menu-item`}>
            <HandshakeIcon className="icon" />
            {isExpanded && <span>Reseller Program</span>}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideStickyMenu;
