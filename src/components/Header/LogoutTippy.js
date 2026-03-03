import React, { useEffect } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authAPI } from "../../lib/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import "./Header.css";

const LogoutTippy = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    dispatch(setUser(null));
    navigate("/login");
  };

  const getUserData = async () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    
    if (!token) {
      dispatch(setUser(null));
      return;
    }
    
    try {
      const response = await authAPI.getUserInfo();
      
      if (response.ok) {
        const res = await response.json();
        const user = res.data || res;
        
        if (user && (user._id || user.name || user.email)) {
          dispatch(setUser(user));
        } else {
          if (response.status === 401 || response.status === 403) {
            dispatch(setUser(null));
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
          } else {
            dispatch(setUser(null));
          }
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          dispatch(setUser(null));
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
        } else {
          dispatch(setUser(null));
        }
      }
    } catch (error) {
      dispatch(setUser(null));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="logout-tippy">
      {user && user ? (
        <>
          <div className="section-1">
            <span>
              <Person2Icon className="me-2 icon" />
            </span>
            <span onClick={() => navigate("/user-dashboard")}>
              My Dashboard
            </span>
          </div>
          <div className="section-2">
            <span>
              <LogoutIcon className="me-2 icon" />
            </span>
            <span onClick={handleLogout}>Logout</span>
          </div>
        </>
      ) : (
        <>
          <div className="section-1">
            <span onClick={() => navigate("/login")}>Login</span>
          </div>
          <hr />
          <div className="section-1">
            <span onClick={() => navigate("/register")}>Register</span>
          </div>
        </>
      )}
    </div>
  );
};

export default LogoutTippy;
