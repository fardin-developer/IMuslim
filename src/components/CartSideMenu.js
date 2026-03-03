import React, { useEffect, useState } from "react";
import "./CartSideMenu.css";
import CloseIcon from "@mui/icons-material/Close";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { Link, useNavigate } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const CartSideMenu = ({ cartMenu, setCartMenu }) => {
  const handleCartMenuClick = (e) => {
    e.stopPropagation();
  };
  const navigate = useNavigate();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [total, setTotal] = useState(0);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    const newTotal = cart.reduce((acc, item) => acc + parseInt(item.price), 0);
    setTotal(newTotal);
  };

  const handleRemoveItem = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        const updatedQuantity = Math.max(1, cartItem.quantity - 1);
        return { ...cartItem, quantity: updatedQuantity };
      }
      return cartItem;
    });

    updateCart(updatedCart);
  };

  const handleAddItem = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        const updatedQuantity = cartItem.quantity + 1;
        return { ...cartItem, quantity: updatedQuantity };
      }
      return cartItem;
    });

    updateCart(updatedCart);
  };

  const handleDeleteItem = (item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    updateCart(updatedCart);
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  return (
    <div
      onClick={() => setCartMenu(!cartMenu)}
      className={`cart-menu-container ${cartMenu ? "active" : ""}`}
    >
      <div
        onClick={handleCartMenuClick}
        className={`cart-menu ${cartMenu ? "active" : ""}`}
      >
        <div className="topper">
          <span>
            <b>YOUR CART</b>
          </span>
          <CloseIcon className="icon" onClick={() => setCartMenu(!cartMenu)} />
        </div>
        <hr />
        <div className="cart-bag cart-menu-bag">
          {cart && cart?.length > 0 && (
            <div className="cart-item-container">
              {cart &&
                cart?.map((item, index) => {
                  return (
                    <div key={index} className="cart-item">
                      <div className="cart-item-img">
                        <img src={item?.images[0]} alt="" />
                      </div>
                      <div className="cart-item-details">
                        <span className="m-0 p-0">{item?.name}</span>
                        <span>Amount: {item?.amount}</span>
                        <span>
                          <b>Rs. {item?.price}</b>
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
              <div className="w-100 d-flex justify-content-between">
                <span>Subtotal</span>
                <h5>
                  <b>Rs. {total}</b>
                </h5>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-100 add-to-cart-btn"
              >
                Checkout
              </button>
              <Link className="view-cart" to="/cart">
                View Cart
              </Link>
            </div>
          )}
        </div>
        {cart && cart.length === 0 && (
          <div className="cart-items">
            <ProductionQuantityLimitsIcon className="icon" />
            <span>Your cart is empty</span>
            <Link to="/games">Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSideMenu;
