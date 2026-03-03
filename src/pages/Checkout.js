import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import "./Checkout.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { setUser } from "../redux/features/userSlice";
import CheckIcon from "@mui/icons-material/Check";
import getUserData from "../utils/userDataService.js";
import CryptoJS from "crypto-js";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { discount } = useSelector((state) => state.discount);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [mode, setMode] = useState("upi");
  const [processingOrder, setProcessingOrder] = useState(false); // Flag for processing order
  const [balance, setBalance] = useState("");

  useEffect(() => {
    getUserData(dispatch, setUser, setBalance);
  }, []);

  //? ========================= LOCATION ==============
  //? Getting IP ADDRESS
  const [location, setLocation] = useState({
    ipAddress: null,
    latitude: null,
    longitude: null,
    address: {},
  });
  const [allowedLocation, setAllowedLocation] = useState(false);

  async function fetchIP() {
    try {
      const response = await fetch("https://api.ipify.org");
      const data = await response.text();
      setLocation((prevLocation) => ({ ...prevLocation, ipAddress: data }));
    } catch (error) {
      console.error("Failed to fetch IP:", error);
    }
  }

  useEffect(() => {
    fetchIP();
  }, []);

  //? getting location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
          setAllowedLocation(true);
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            setLocation((prevLocation) => ({
              ...prevLocation,
              address: data.address,
            }));
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  //? ========================= LOCATION ==============

  const secretKey = "DIVINESTOREORIG@#$123";
  const decryptPrice = (encryptedPrice) => {
    if (!secretKey) {
      console.error("Secret key is not defined");
      return encryptedPrice;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedPrice, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const calculateTotal = () => {
    const newTotal = cart.reduce(
      (acc, item) => acc + parseInt(decryptPrice(item.price)),
      0
    );
    setTotal(newTotal);
  };

  const generateOrderId = () => {
    const numbers = "01234567"; // 10 numbers
    const randomNumbers = Array.from({ length: 7 }, () =>
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    );
    const orderId = randomNumbers.join("");
    setOrderId(orderId);
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  useEffect(() => {
    generateOrderId();
  }, []);

  function checkPlaceOrder(e) {
    if (cart[0]?.api === "yes") {
      if (cart[0]?.apiName === "yokcash") {
        if (mode === "upi") {
          handleYokcashUpiOrder(e);
        } else {
          handleYokcashWalletOrder(e);
        }
      } else if (cart[0]?.apiName === "smileOne") {
        if (mode === "upi") {
          handleSmileOneUpiOrder(e);
        } else {
          handleSmileOneWalletOrder(e);
        }
      } else if (cart[0]?.apiName === "moogold") {
        if (mode === "upi") {
          handleMoogoldUpiOrder(e);
        } else {
          handleMoogoldWalletOrder(e);
        }
      }
    } else {
      if (mode === "upi") {
        handleUpiOrder(e);
      } else {
        handleWalletOrder(e);
      }
    }
  }

  //? YOKCASH UPI ORDER
  async function handleYokcashUpiOrder(e) {
    e.preventDefault();
    try {
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const paymentObject = {
        order_id: orderId,
        txn_amount: decryptPrice(cart[0]?.price),
        product_name: cart[0]?.amount,
        customer_name: user?.fname,
        customer_email: user?.email,
        customer_mobile: user?.mobile,
        callback_url: `https://divinestoreorig.com/api/yokcash/check-yokcash-upi-order?orderId=${orderId}`,
        txn_note: playerId + "#" + cart[0]?.zoneId + "#" + cart[0]?.productId,
      };

      const response = await axios.post(
        "/api/payment/create-api-upi-order",
        paymentObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success && response.data.data.status) {
        window.location.href = response.data.data.results.payment_url;
        setLoading(false);
      } else {
        message.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //? YOKCASH WALLET ORDER
  async function handleYokcashWalletOrder(e) {
    try {
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const paymentObject = {
        order_id: orderId,
        txn_amount: decryptPrice(cart[0]?.price),
        product_name: cart[0]?.amount,
        customer_email: user?.email,
        customer_mobile: user?.mobile,
        txn_note: playerId + "#" + cart[0]?.zoneId + "#" + cart[0]?.productId,
      };
      setLoading(true);
      const res = await axios.post(
        "/api/yokcash/place-yokcash-from-wallet",
        paymentObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        localStorage.removeItem("cart");
        localStorage.setItem("orderProcess", "no");
        setLoading(false);
        setOrderSuccess(true);
      } else {
        setLoading(false);
        message.error(res.data.message);
        localStorage.setItem("orderProcess", "no");
      }
    } catch (error) {
      console.log(error);
    }
  }

  //* SMILE ONE UPI ORDER
  const handleSmileOneUpiOrder = async (e) => {
    e.preventDefault();
    try {
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const paymentObject = {
        order_id: orderId,
        txn_amount: decryptPrice(cart[0]?.price),
        product_name: cart[0]?.region + "#" + cart[0]?.amount,
        customer_name: user?.fname,
        customer_email: user?.email,
        customer_mobile: user?.mobile,
        callback_url: `https://divinestoreorig.com/api/payment/check-api-upi-order?orderId=${orderId}`,
        txn_note: playerId + "#" + cart[0]?.zoneId + "#" + cart[0]?.productId,
      };
      const response = await axios.post(
        "/api/payment/create-api-upi-order",
        paymentObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success && response.data.data.status) {
        window.location.href = response.data.data.results.payment_url;
        localStorage.removeItem("cart");
        setLoading(false);
      } else {
        message.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //* SMILE ONE WALLET ORDER
  const handleSmileOneWalletOrder = async (e) => {
    e.preventDefault();
    const playerId =
      cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
    const orderObject = {
      // for placing order in smile one
      orderId: orderId,
      userid: playerId,
      zoneid: cart[0]?.zoneId,
      productid: cart[0]?.productId,
      region: cart[0]?.region,
      // for storing data for admin order
      customer_email: user && user?.email,
      customer_mobile: user && user?.mobile,
      pname: cart[0]?.name,
      amount: cart[0]?.amount,
      price: decryptPrice(cart[0]?.price),
    };
    setLoading(true);
    const res = await axios.post(
      "/api/payment/place-order-from-wallet",
      orderObject,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.data.success) {
      message.success(res.data.message);
      localStorage.removeItem("cart");
      localStorage.setItem("orderProcess", "no");
      setLoading(false);
      setOrderSuccess(true);
    } else {
      setLoading(false);
      message.error(res.data.message);
      localStorage.setItem("orderProcess", "no");
    }
  };

  //! MOOGOLE UPI ORDER
  async function handleMoogoldUpiOrder(e) {
    e.preventDefault();
    try {
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const paymentObject = {
        order_id: orderId,
        txn_amount: decryptPrice(cart[0]?.price),
        product_name: cart[0]?.amount,
        customer_name: user?.fname,
        customer_email: user?.email,
        customer_mobile: user?.mobile,
        callback_url: `https://divinestoreorig.com/api/moogold/check-moogold-upi-order?orderId=${orderId}`,
        txn_note: playerId + "#" + cart[0]?.zoneId + "#" + cart[0]?.productId,
      };

      const response = await axios.post(
        "/api/payment/create-api-upi-order",
        paymentObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success && response.data.data.status) {
        window.location.href = response.data.data.results.payment_url;
        setLoading(false);
      } else {
        message.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //! MOOGOLE WALLET ORDER
  async function handleMoogoldWalletOrder(e) {
    e.preventDefault();
    if (processingOrder) return; // If order is already being processed, return
    setProcessingOrder(true); // Set flag to indicate order processing
    if (localStorage.getItem("orderProcess") === "yes") {
      return message.error("Previous order is in process");
    }
    localStorage.setItem("orderProcess", "yes");
    try {
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const orderObject = {
        api: "no",
        order_id: orderId,
        txn_amount: decryptPrice(cart[0]?.price),
        product_name: cart[0]?.amount,
        customer_email: user?.email,
        customer_mobile: user?.mobile,
        txn_note: playerId + "#" + cart[0]?.zoneId + "#" + cart[0]?.productId,
      };
      setLoading(true);
      const res = await axios.post(
        "/api/moogold/place-moogold-from-wallet",
        orderObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        // localStorage.removeItem("cart");
        localStorage.setItem("orderProcess", "no");
        setLoading(false);
        setOrderSuccess(true);
      } else {
        setLoading(false);
        message.error(res.data.message);
        localStorage.setItem("orderProcess", "no");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // MANUAL UPI ORDER
  const handleUpiOrder = async (e) => {
    e.preventDefault();
    try {
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const paymentObject = {
        order_id: orderId,
        txn_amount: decryptPrice(cart[0]?.price),
        txn_note: playerId + "@" + cart[0]?.amount,
        product_name: cart[0]?.name,
        customer_name: user?.fname,
        customer_mobile: user?.mobile,
        customer_email: user?.email,
        callback_url: `https://divinestoreorig.com/api/payment/check-manual-upi-order?orderId=${orderId}`,
      };
      const response = await axios.post(
        "/api/payment/create-manual-upi-order",
        paymentObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success && response.data.data.status) {
        window.location.href = response.data.data.results.payment_url;
        localStorage.removeItem("cart");
        setLoading(false);
      } else {
        message.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // MANUAL WALLET ORDER
  const handleWalletOrder = async (e) => {
    e.preventDefault();
    if (processingOrder) return; // If order is already being processed, return
    setProcessingOrder(true); // Set flag to indicate order processing
    if (localStorage.getItem("orderProcess") === "yes") {
      return message("Previous order is in process");
    }
    localStorage.setItem("orderProcess", "yes");

    try {
      setLoading(true);
      const playerId =
        cart[0]?.playerId !== "" ? cart[0]?.playerId : cart[0]?.userId;
      const orderObject = {
        api: "no",
        orderId: orderId,
        userid: playerId,
        zoneid: cart[0]?.zoneId,
        productid: cart[0]?.productId,
        region: cart[0]?.region,
        customer_email: user && user?.email,
        customer_mobile: user && user?.mobile,
        pname: cart[0]?.name,
        amount: cart[0]?.amount,
        price: decryptPrice(cart[0]?.price),
      };
      const res = await axios.post(
        "/api/payment/place-order-non-api",
        orderObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setLoading(false);
        message.success(res.data.message);
        navigate("/orders");
        localStorage.removeItem("cart");
        localStorage.setItem("orderProcess", "no");
      } else {
        message.error(res.data.message);
        setLoading(false);
        localStorage.setItem("orderProcess", "no");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      localStorage.setItem("orderProcess", "no");
    }
  };



  useEffect(() => {
    if (!localStorage.getItem("orderProcess")) {
      localStorage.setItem("orderProcess", "no");
    }
  }, []);

  return (
    <Layout>
      {orderSuccess ? (
        <div className="order-success-container">
          <CheckIcon className="icon" />
          <span className="text-muted">Hey! {user?.fname}</span>
          <h4 className="my-1">Thank you for ordering!</h4>
          <span className="text-muted text-center">
            We have received your order and it will completed instantly!
          </span>
          <button
            onClick={() => {
              navigate("/user-dashboard");
              setOrderSuccess(false);
            }}
            className="add-to-cart-btn"
          >
            Check Order Status
          </button>
        </div>
      ) : loading ? (
        <div className="order-placing-loader">
          <div class="me-2 spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <br />
          Do not refresh or take back Otherwise the funds will be lost.
          <br />
          Order Processing!
        </div>
      ) : (
        <div className="container checkout-container">
          <div className="customer-form">
            {!user && (
              <h5>
                Already a customer? <Link to="/login">Login</Link>
              </h5>
            )}
            {user && (
              <div>
                <h5>Account Details</h5>
                <div className="row">
                  <div className="mb-3 col-12 col-sm-12 col-md-6 col-lg-6">
                    <label className="form-label" htmlFor="">
                      Name :
                    </label>
                    <h5>{user && user?.fname}</h5>
                  </div>
                  <div className="mb-3 col-12 col-sm-12 col-md-6 col-lg-6">
                    <label className="form-label" htmlFor="">
                      Email :
                    </label>
                    <h5>{user && user?.email}</h5>
                  </div>
                  <div className="mb-3 col-12 col-sm-12 col-md-6 col-lg-6">
                    <label className="form-label" htmlFor="">
                      Mobile :
                    </label>
                    <h5>{user && user?.mobile}</h5>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CART  */}
          <div className="checkout-product-details">
            <div className="checkout-item-container">
              <div className="d-flex justify-content-between">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              <hr />
              {cart &&
                cart.map((item, index) => {
                  return (
                    <div key={index} className="checkout-item">
                      <span>{item.name}</span>
                      <span>{decryptPrice(item.price)}</span>
                    </div>
                  );
                })}
              <hr />
              <div className="checkout-item">
                <span>
                  <b>Wallet Balance</b>
                </span>
                <span>
                  <b>
                    {user && user ? balance : <Link to="/login">Login</Link>}
                  </b>
                </span>
              </div>
              <div className="checkout-item">
                <span>
                  <b>Total</b>
                </span>
                <span>
                  <b>Rs. {total}</b>
                </span>
              </div>
              <div className="checkout-item">
                <span>
                  <b>Payment Mode</b>
                </span>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMode"
                      id="upiRadio"
                      value="upi"
                      checked={mode === "upi"}
                      onChange={() => setMode("upi")}
                    />
                    <label className="form-check-label" htmlFor="upiRadio">
                      UPI
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMode"
                      id="walletRadio"
                      value="wallet"
                      checked={mode === "wallet"}
                      onChange={() => setMode("wallet")}
                    />
                    <label className="form-check-label" htmlFor="walletRadio">
                      Wallet
                    </label>
                  </div>
                </div>
              </div>
              {balance >= total && mode === "wallet" && (
                <div className="checkout-item">
                  <span>Balance after order</span>
                  <span>
                    <b>Rs. {balance - total}</b>
                  </span>
                </div>
              )}
            </div>
            {!allowedLocation ? (
              <button className="w-100 add-to-cart-btn">
                <Link
                  to="https://wa.me/917085165780"
                  target="_blank"
                  className="text-dark"
                >
                  Contact Admin
                </Link>
              </button>
            ) : !user?.mobileVerified || !user?.emailVerified ? (
              <button
                onClick={() => {
                  message.error(
                    `Verify Your ${!user?.mobileVerified ? "Mobile Number" : "Email"
                    }`
                  );
                  navigate("/my-account");
                }}
                className="w-100 add-to-cart-btn"
              >
                {!user?.mobileVerified
                  ? "Verify your Mobile Number"
                  : "Verify your Email"}
              </button>
            ) : user?.block === "yes" ? (
              <button className="w-100 add-to-cart-btn">Out of Stock</button>
            ) : user && mode === "upi" ? (
              <button
                onClick={checkPlaceOrder}
                className="w-100 add-to-cart-btn"
              >
                Place Order
              </button>
            ) : balance >= total ? (
              <button
                onClick={checkPlaceOrder}
                className="w-100 add-to-cart-btn"
              >
                Place Order
              </button>
            ) : balance < total ? (
              <button
                onClick={() => navigate("/wallet")}
                className="w-100 add-to-cart-btn"
              >
                Topup your wallet
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-100 add-to-cart-btn"
              >
                Login to Continue
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Checkout;
