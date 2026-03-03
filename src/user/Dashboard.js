import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { orderAPI } from "../lib/api";
import DashboardLayout from "./components/DashboardLayout";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import TollIcon from "@mui/icons-material/Toll";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useAuth } from "../context/AuthContext";
import PaymentIcon from "@mui/icons-material/Payment";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { balance } = useAuth();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllUserOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderHistory({});
      const res = await response.json();
      if (res.success) {
        setAllOrders(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user !== null) {
      getAllUserOrders();
    }
  }, [user]);

  return (
    <Layout>
      <DashboardLayout>
        <div className="dashboard-header">
          <h4 className="dashboard-title">Dashboard</h4>
        </div>
        <div className="user-dashboard">
          <div className="shadow dash-card" onClick={() => navigate("/orders")}>
            <div className="dash-card-content">
              <div className="dash-card-info">
                <div className="dash-card-number">
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <b>{allOrders?.length || 0}</b>
                  )}
                </div>
                <span className="dash-card-label">Total Orders</span>
              </div>
              <div className="dash-card-icon">
                <InstallMobileIcon />
              </div>
            </div>
          </div>

          <div className="shadow dash-card" onClick={() => navigate("/wallet")}>
            <div className="dash-card-content">
              <div className="dash-card-info">
                <div className="dash-card-number">
                  <b>₹{parseFloat(balance || 0).toFixed(2)}</b>
                </div>
                <span className="dash-card-label">HV Coins</span>
              </div>
              <div className="dash-card-icon">
                <TollIcon />
              </div>
            </div>
          </div>

          <div
            className="shadow dash-card"
            onClick={() => navigate("/my-account")}
          >
            <div className="dash-card-content">
              <div className="dash-card-info">
                <div className="dash-card-number">
                  <b>{user?.name ? user.name.split(' ')[0] : 'Account'}</b>
                </div>
                <span className="dash-card-label">My Account</span>
              </div>
              <div className="dash-card-icon">
                <AccountCircleIcon />
              </div>
            </div>
          </div>

          <div
            className="shadow dash-card"
            onClick={() => navigate("/payments")}
          >
            <div className="dash-card-content">
              <div className="dash-card-info">
                <div className="dash-card-number">
                  <b>--</b>
                </div>
                <span className="dash-card-label">Payments</span>
              </div>
              <div className="dash-card-icon">
                <PaymentIcon />
              </div>
            </div>
          </div>

          <div className="shadow dash-card" onClick={() => navigate("/query")}>
            <div className="dash-card-content">
              <div className="dash-card-info">
                <div className="dash-card-number">
                  <b>--</b>
                </div>
                <span className="dash-card-label">Queries</span>
              </div>
              <div className="dash-card-icon">
                <QuestionAnswerIcon />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default Dashboard;
