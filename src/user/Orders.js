import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import DashboardLayout from "./components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../lib/api";
import { useSelector } from "react-redux";
import { message } from "antd";
import Loader from "../pages/Loader";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const getAllUserOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderHistory({});
      const res = await response.json();
      if (res.success) {
        // API returns orders in res.orders, not res.data
        const ordersList = res.orders || res.data || [];
        setOrders(ordersList.reverse());
        setData(ordersList);
        setLoading(false);
      } else {
        setLoading(false);
        message.error(res.message || "Failed to load orders");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to load orders");
    }
  };

  useEffect(() => {
    if (user !== null) {
      getAllUserOrders();
    }
  }, [user]);

  useEffect(() => {
    if (!selectedDate) {
      // If no date selected, show all orders
      setOrders(data);
      return;
    }
    const filteredOrders = data?.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const selected = new Date(selectedDate);
      return (
        itemDate.getDate() === selected.getDate() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getFullYear() === selected.getFullYear()
      );
    });
    setOrders(filteredOrders);
  }, [selectedDate, data]);

  function getStatus(status) {
    switch (status?.toLowerCase()) {
      case "pending":
      case "initiated":
        return "text-warning";
      case "processing":
      case "in_progress":
        return "text-primary";
      case "failed":
      case "failure":
        return "text-danger";
      case "success":
      case "completed":
      case "successful":
        return "text-success";
      case "cancelled":
      case "canceled":
      case "refunded":
        return "text-primary";
      default:
        return "text-dark";
    }
  }

  return (
    <Layout>
      <DashboardLayout>
        <div className="user-order-container">
          <div className="tools mb-3">
            <div className="form-fields">
              <input
                type="date"
                className="py-2 form-control"
                placeholder="Search Order ID"
                name="addition"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="form-fields">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setOrders(data);
                }}
              >
                Clear Filter
              </button>
            </div>
          </div>
          {/* DESKTOP */}
          {/* DESKTOP */}
          {/* DESKTOP */}
          <div className="d-none d-lg-block">
            <table className="w-100 table table-bordered">
              <thead>
                <tr>
                  <th>
                    <small>Order ID</small>
                  </th>
                  <th>
                    <small>Product</small>
                  </th>
                  <th>
                    <small>Order Details</small>
                  </th>
                  <th>
                    <small>Price</small>
                  </th>
                  <th>
                    <small>User Id</small>
                  </th>
                  <th>
                    <small>Date</small>
                  </th>
                  <th>
                    <small>Status</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length === 0 ? (
                  <tr>
                    <td align="center" colSpan={10}>
                      No order found
                    </td>
                  </tr>
                ) : (
                  orders?.map((item, index) => {
                    // Parse description if it's a JSON string
                    let descriptionData = {};
                    try {
                      descriptionData = item.description ? JSON.parse(item.description) : {};
                    } catch (e) {
                      descriptionData = {};
                    }
                    
                    const productName = item.gameName || item.items?.[0]?.itemName || item.p_info || "N/A";
                    const orderAmount = item.amount || item.items?.[0]?.price || item.price || 0;
                    const playerId = descriptionData.playerId || item.playerId || "N/A";
                    
                    return (
                      <tr key={item._id || index}>
                        <td>
                          <small>{item.orderId}</small>
                        </td>
                        <td>
                          <small>{productName}</small>
                        </td>
                        <td>
                          <small>{item.items?.[0]?.itemName || item.amount || "N/A"}</small>
                        </td>
                        <td>
                          <small>₹{parseFloat(orderAmount).toFixed(2)}</small>
                        </td>
                        <td>
                          <small>{playerId}</small>
                        </td>
                        <td>
                          <small>
                            {new Date(item?.createdAt).toLocaleString(
                              "default",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              }
                            )}
                          </small>
                        </td>
                        <td>
                          <small className={getStatus(item?.status)}>{item?.status || "N/A"}</small>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          {/* MOBILE */}
          {/* MOBILE */}
          <div className="d-block d-lg-none wallet-history-mobile">
            {orders && orders?.length === 0 ? (
              <div className="whistory m-0">No order found</div>
            ) : (
              orders?.map((item, index) => {
                // Parse description if it's a JSON string
                let descriptionData = {};
                try {
                  descriptionData = item.description ? JSON.parse(item.description) : {};
                } catch (e) {
                  descriptionData = {};
                }
                
                const productName = item.gameName || item.items?.[0]?.itemName || item.p_info || "N/A";
                const orderAmount = item.amount || item.items?.[0]?.price || item.price || 0;
                const playerId = descriptionData.playerId || item.playerId || "N/A";
                const server = descriptionData.server || item.zoneId || item.server || null;
                
                return (
                  <div className="whistory" key={item._id || index}>
                    <div className="items">
                      <span className="fw-bold">Date</span>
                      <span className="fw-bold text-success">
                        {new Date(
                          item?.createdAt || item?.created
                        ).toLocaleString("default", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="items">
                      <div className="item-name">
                        <span>Order Id</span>
                      </div>
                      <div className="item-details text-primary">
                        <span>{item?.orderId}</span>
                      </div>
                    </div>
                    <div className="items">
                      <div className="item-name">
                        <span>Product</span>
                      </div>
                      <div className="item-details">
                        <span>{productName}</span>
                      </div>
                    </div>

                    <div className="items">
                      <div className="item-name">
                        <span>Order Details</span>
                      </div>
                      <div className="item-details">
                        <span>{item.items?.[0]?.itemName || item.amount || "N/A"}</span>
                      </div>
                    </div>
                    <div className="items">
                      <div className="item-name">
                        <span>Price</span>
                      </div>
                      <div className="item-details">
                        <span>₹{parseFloat(orderAmount).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="items">
                      <div className="item-name">
                        <span>Player Id</span>
                      </div>
                      <div className="item-details">
                        <span>{playerId}</span>
                      </div>
                    </div>
                    {server && (
                      <div className="items">
                        <div className="item-name">
                          <span>Server</span>
                        </div>
                        <div className="item-details">
                          <span>{server}</span>
                        </div>
                      </div>
                    )}
                    <div className="items">
                      <div className="item-name">
                        <span>Status</span>
                      </div>
                      <div className="item-details">
                        <span className={getStatus(item?.status)}>
                          {item?.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default Orders;
