import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import HowItWorks from "../components/Home/HowItWorks";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import CryptoJS from "crypto-js";

const Cart = () => {
  const navigate = useNavigate();
  const { discount } = useSelector((state) => state.discount);
  const [check, setCheck] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [total, setTotal] = useState(0);
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const calculateTotal = () => {
    const newTotal = cart.reduce(
      (acc, item) => acc + parseInt(decryptPrice(item.price)),
      0
    );
    setTotal(newTotal);
  };
  const handleDeleteItem = (item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    updateCart(updatedCart);
  };
  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const secretKey = "ARHOFFICIAL@#$123";
  const decryptPrice = (encryptedPrice) => {
    if (!secretKey) {
      console.error("Secret key is not defined");
      return encryptedPrice;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedPrice, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return (
    <Layout>
      <div className="cart-container container">
        <div className={`cart-bag ${cart?.length === 0 && "w-100"}`}>
          <h3 className="m-0">Your Cart</h3>
          {cart && cart?.length === 0 && <hr className="d-none d-lg-block" />}
          <hr className="d-block d-lg-none" />
          <div className="cart-item-container">
            {cart && cart?.length === 0 ? (
              <div
                style={{
                  minHeight: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
                className="cart-items"
              >
                <ProductionQuantityLimitsIcon className="icon" />
                <span>Your cart is empty</span>
                <Link to="/games">Continue Shopping</Link>
              </div>
            ) : (
              <>
                {cart &&
                  cart?.map((item, index) => {
                    return (
                      <div key={index} className="cart-item">
                        <div className="cart-item-img">
                          <img
                            src={`https://divinestoreorig.com/${item?.image}`}
                            alt=""
                          />
                        </div>
                        <div className="cart-item-details">
                          <span className="m-0 p-0">{item?.name}</span>
                          {cart[0]?.api === "no" && (
                            <span className="m-0 p-0">
                              User ID - {cart[0]?.playerId}
                            </span>
                          )}
                          {cart[0]?.api !== "no" && (
                            <span className="m-0 p-0">
                              User ID - {cart[0]?.userId}
                            </span>
                          )}
                          {cart[0]?.apiName === "smileOne" ? (
                            <span className="m-0 p-0">
                              Username - {cart[0]?.username}
                            </span>
                          ) : (
                            cart[0]?.apiName === "moogold" &&
                            cart[0]?.gameName === "15145" && (
                              <span className="m-0 p-0">
                                Username - {cart[0]?.username}
                              </span>
                            )
                          )}
                          {cart[0]?.apiName === "smileOne" ? (
                            <span className="m-0 p-0">
                              Zone ID - {cart[0]?.zoneId}
                            </span>
                          ) : (
                            cart[0]?.apiName === "moogold" &&
                            (cart[0]?.gameName === "15145" ||
                              cart[0]?.gameName === "428075" ||
                              cart[0]?.gameName === "ML Region Luar") && (
                              <span className="m-0 p-0">
                                {cart[0]?.gameName === "428075" ||
                                cart[0]?.gameName === "Honkai Star Rail"
                                  ? "Server - "
                                  : "Zone ID - "}
                                {cart[0]?.zoneId}
                              </span>
                            )
                          )}
                          <span>Amount: {item?.amount}</span>
                          <span>
                            <b>Rs. {decryptPrice(item?.price)}</b>
                          </span>
                        </div>
                        <div className="cart-item-delete">
                          <DeleteIcon
                            className="icon m-0"
                            onClick={() => handleDeleteItem(item)}
                          />
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
          {cart && cart.length > 0 && (
            <div className="cart-total">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexCheckDefault"
                  onClick={() => setCheck(!check)}
                />
                <label class="form-check-label" for="flexCheckDefault">
                  By Clicking on this check box you confirm that the player
                  username is correct
                </label>
              </div>
            </div>
          )}
        </div>
        {cart && cart.length > 0 && (
          <div className="cart-total">
            <h4>Price Details</h4>
            <hr className="m-0 mb-3" />
            <div className="d-flex justify-content-between">
              <h6>Subtotal</h6>
              <h6 className="bold-text">Rs. {total}</h6>
            </div>
            {discountApplied && (
              <div className="d-flex justify-content-between">
                <h6>Discount</h6>
                <h6 className="bold-text">
                  - Rs. {discount}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setDiscountApplied(false)}
                    className="ms-2"
                  >
                    <small>(remove)</small>
                  </span>
                </h6>
              </div>
            )}
            <div className="d-flex justify-content-between">
              <h6>Total</h6>
              <h4 className="m-0">
                <b>Rs. {total - (discountApplied && discount)}</b>
              </h4>
            </div>
            {check ? (
              <>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-100 add-to-cart-btn m-0"
                >
                  Checkout
                </button>
                <span className="text-center m-0">
                  <small>Taxes & Shipping calculated at checkout</small>
                </span>
              </>
            ) : (
              <>
                <button
                  onClick={() => message.error("Please select the check box")}
                  className="w-100 add-to-cart-btn m-0"
                >
                  Please select the check box
                </button>
                <span className="text-center m-0">
                  <small>Taxes & Shipping calculated at checkout</small>
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <HowItWorks />
    </Layout>
  );
};

export default Cart;
