import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import DashboardLayout from "./components/DashboardLayout";
import Layout from "../components/Layout/Layout";
import { walletAPI, transactionAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import TollIcon from "@mui/icons-material/Toll";
import HistoryIcon from "@mui/icons-material/History";
import IMAGES from "../img/image.js";
import website from "../website/data.js";
import "./Wallet.css";

const Wallet = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { balance, refreshBalance } = useAuth();
  const [tab, setTab] = useState(location.state?.tab ?? 1);
  const [btn, setBtn] = useState(0);
  const [form, setForm] = useState({ email: "", amount: "" });
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [histories, setHistories] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  const generateOrderId = () => {
    const numbers = "01234567"; // 8 numbers
    const randomNumbers = Array.from({ length: 7 }, () =>
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    );
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
    const year = String(now.getFullYear()).slice(2); // last two digits of the year
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const orderId = `${year}${month}${day}${seconds}${randomNumbers.join("")}`;
    setOrderId(orderId);
  };

  useEffect(() => {
    generateOrderId();
    // Refresh balance on component mount
    refreshBalance();
  }, [refreshBalance]);

  async function submitPayment() {
    // Validate amount
    if (!form?.amount || form.amount.trim() === "") {
      setError(true);
      return message.error("Please enter an amount");
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError(true);
      return message.error("Please enter a valid amount");
    }

    try {
      setLoading(true);
      setError(false);
      // Use walletAPI.addCoins for adding coins
      const redirectUrl = `${window.location.origin}/payment-status`;
      console.log("Submitting payment with amount:", amount, "redirectUrl:", redirectUrl);
      const response = await walletAPI.addCoins(amount, redirectUrl);
      const res = await response.json();
      console.log("Payment response:", res);
      if (res.success) {
        // If API returns payment URL, redirect to it
        const paymentUrl = res.data?.payment_url || res.data?.paymentUrl || res.transaction?.paymentUrl;
        if (paymentUrl) {
          message.success(res.message || "Redirecting to payment gateway...");
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 500);
        } else {
          message.success(res.message || "Coins added successfully");
          refreshBalance();
          setForm({ email: "", amount: "" }); // Reset form
        }
        setLoading(false);
      } else {
        message.error(res.message || "Failed to add coins");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      message.error("Failed to add coins");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedDate) {
      // If no date selected, show all transactions
      setHistories(historyData);
      return;
    }
    const filteredHis = historyData?.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const selected = new Date(selectedDate);
      return (
        itemDate.getDate() === selected.getDate() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getFullYear() === selected.getFullYear()
      );
    });
    setHistories(filteredHis);
  }, [selectedDate, historyData]);

  async function getHistories() {
    try {
      // Use transactionAPI to get wallet history
      const response = await transactionAPI.getTransactionHistory({});
      const res = await response.json();
      if (res.success) {
        // API returns transactions in res.transactions, not res.data
        const transactions = res.transactions || res.data || [];
        setHistories(transactions.reverse());
        setHistoryData(transactions);
      } else {
        message.error(res.message || "Failed to load transaction history");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to load transaction history");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });
    if (name === "amount") {
      if (value < 20) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }

  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({
        ...prev,
        customer_email: user?.email,
        customer_name: user?.fname,
        customer_mobile: user?.mobile,
      }));
      getHistories();
      // Refresh balance when wallet component mounts or user changes
      refreshBalance();
    }
  }, [user, refreshBalance]);

  return (
    <Layout>
      <DashboardLayout>
        <div className="wallet-dash">
          <div className="bal w-100">
            <img width="25px" src={IMAGES.ycoin} className="me-2" alt="" />
            HV coins: {parseFloat(balance).toFixed(2)}
          </div>
          <div className="wallet-dash-tabs">
            <div
              className={`wallet-dash-card ${tab === 1 && "active"}`}
              onClick={() => setTab(1)}
            >
              Add HV Coins
              <img width="25px" src={IMAGES.ycoin} alt="" />
            </div>
            <div
              className={`wallet-dash-card ${tab === 0 && "active"}`}
              onClick={() => setTab(0)}
            >
              Transaction History
              <HistoryIcon className="icon ms-2" />
            </div>
          </div>
        </div>

        {/* TXN HISTORY */}
        {/* TXN HISTORY */}
        {/* TXN HISTORY */}
        {tab === 0 && (
          <>
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
                    setSelectedDate("");
                    setHistories(historyData);
                  }}
                >
                  Clear Filter
                </button>
              </div>
            </div>

            {/* DESKTOP */}
            {/* DESKTOP */}
            {/* DESKTOP */}
            <div className="d-none d-md-none d-lg-block ">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      <small>Sr No</small>
                    </th>
                    <th>
                      <small>Order ID</small>
                    </th>
                    <th>
                      <small>Price</small>
                    </th>
                    <th>
                      <small>Balance Before</small>
                    </th>
                    <th>
                      <small>Balance After</small>
                    </th>
                    <th>
                      <small>Product Info</small>
                    </th>
                    <th>
                      <small>Status</small>
                    </th>
                    <th>
                      <small>Date</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {histories && histories?.length === 0 ? (
                    <tr>
                      <td align="center" colSpan={9}>
                        No record found
                      </td>
                    </tr>
                  ) : (
                    histories?.map((item, index) => {
                      const transactionType = item.udf2 || item.type || "N/A";
                      const productInfo = item.paymentNote || item.product || "N/A";
                      const statusClass = item.status === "pending" ? "text-warning" : 
                                        item.status === "success" || item.status === "completed" ? "text-success" :
                                        item.status === "failed" ? "text-danger" : "text-dark";
                      
                      return (
                        <tr key={item._id || index}>
                          <td>
                            <small>{index + 1}</small>
                          </td>
                          <td>
                            <small>{item.orderId}</small>
                          </td>
                          <td>
                            <small>₹{parseFloat(item.amount || 0).toFixed(2)}</small>
                          </td>
                          <td>
                            <small>{item.balanceBefore ? `₹${item.balanceBefore}` : "N/A"}</small>
                          </td>
                          <td>
                            <small>{item.balanceAfter ? `₹${item.balanceAfter}` : "N/A"}</small>
                          </td>
                          <td>
                            <small>{productInfo}</small>
                          </td>
                          <td>
                            <small className={statusClass}>{item.status || transactionType}</small>
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
              {histories && histories?.length === 0 ? (
                <div className="whistory m-0">No record found</div>
              ) : (
                histories?.map((item, index) => {
                  const transactionType = item.udf2 || item.type || "N/A";
                  const productInfo = item.paymentNote || item.product || "N/A";
                  const statusClass = item.status === "pending" ? "text-warning" : 
                                    item.status === "success" || item.status === "completed" ? "text-success" :
                                    item.status === "failed" ? "text-danger" : "text-dark";
                  
                  return (
                    <div className="whistory" key={item._id || index}>
                      <div className="items">
                        <span className="fw-bold">Transaction Details</span>
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
                          <span>Product Info</span>
                        </div>
                        <div className="item-details">
                          <span>{productInfo}</span>
                        </div>
                      </div>

                      {item?.orderInfo && (
                        <div className="items">
                          <div className="item-name">
                            <span>Order Info</span>
                          </div>
                          <div className="item-details">
                            <span>{item?.orderInfo}</span>
                          </div>
                        </div>
                      )}

                      <div className="items">
                        <div className="item-name">
                          <span>Amount</span>
                        </div>
                        <div className="item-details">
                          <span>₹{parseFloat(item?.amount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      {item?.balanceBefore && (
                        <div className="items">
                          <div className="item-name">
                            <span>Balance Before</span>
                          </div>
                          <div className="item-details">
                            <span>₹{item.balanceBefore}</span>
                          </div>
                        </div>
                      )}
                      {item?.balanceAfter && (
                        <div className="items">
                          <div className="item-name">
                            <span>Balance After</span>
                          </div>
                          <div className="item-details">
                            <span>₹{item.balanceAfter}</span>
                          </div>
                        </div>
                      )}
                      <div className="items">
                        <div className="item-name">
                          <span>Status</span>
                        </div>
                        <div className={`item-details ${statusClass}`}>
                          <span>{item?.status || transactionType}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* BARCODE  */}
        {tab === 1 && (
          <div className="add-money">
            <div className="txn-details">
              <div className="form-fields mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter amount"
                  name="amount"
                  onChange={handleChange}
                  value={form?.amount}
                />
              </div>
              <button onClick={submitPayment} className="w-100 theme-btn mt-2">
                Pay Online
              </button>
            </div>
          </div>
        )}
      </DashboardLayout>
    </Layout>
  );
};

export default Wallet;
