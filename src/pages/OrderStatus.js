import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { message } from "antd";
import { orderAPI } from "../lib/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "./ProductInfo.css";

const OrderStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderStatus = async (orderId) => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderAPI.getOrderStatus(orderId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Failed to fetch order status";
        setError(errorMessage);
        message.error(errorMessage);
        setLoading(false);
        return;
      }
      
      const res = await response.json();
      
      if (res.success && res.order) {
        setOrderData(res);
        setError(null);
      } else {
        const errorMessage = res.message || "Order not found";
        setError(errorMessage);
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      const errorMessage = "Failed to fetch order status";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get orderId from URL parameters
    const orderId = searchParams.get('orderId') || searchParams.get('client_txn_id') || searchParams.get('clientTrxId');
    
    if (orderId) {
      fetchOrderStatus(orderId);
    } else {
      message.error("No order ID found");
    }
  }, [searchParams, navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircleIcon style={{ color: '#52c41a', fontSize: '48px' }} />;
      case 'failed':
      case 'error':
        return <ErrorIcon style={{ color: '#ff4d4f', fontSize: '48px' }} />;
      case 'processing':
      case 'pending':
      default:
        return <HourglassEmptyIcon style={{ color: '#faad14', fontSize: '48px' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#52c41a';
      case 'failed':
      case 'error':
        return '#ff4d4f';
      case 'processing':
      case 'pending':
      default:
        return '#faad14';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'Order Completed Successfully';
      case 'failed':
      case 'error':
        return 'Order Failed';
      case 'processing':
        return 'Order is Being Processed';
      case 'pending':
        return 'Order is Pending';
      default:
        return 'Order Status Unknown';
    }
  };

  if (loading && !orderData) {
    return (
      <Layout>
        <div className="productpage">
          <div className="pageheading">
            <span onClick={() => navigate("/")}>
              <ArrowBackIosIcon className="icon" />
              Go Back
            </span>
            <h5>Order Status</h5>
          </div>
          <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: '15px' }}>Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !orderData) {
    const orderId = searchParams.get('orderId') || searchParams.get('client_txn_id');
    return (
      <Layout>
        <div className="productpage">
          <div className="pageheading">
            <span onClick={() => navigate("/")}>
              <ArrowBackIosIcon className="icon" />
              Go Back
            </span>
            <h5>Order Status</h5>
          </div>
          <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
            <ErrorIcon style={{ color: '#ff4d4f', fontSize: '48px', marginBottom: '20px' }} />
            <h3 style={{ color: '#ff4d4f', marginBottom: '15px' }}>Order Not Found</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
            {orderId && (
              <div style={{ marginTop: '20px' }}>
                <button
                  className="p-check-btn"
                  onClick={() => fetchOrderStatus(orderId)}
                  disabled={loading}
                  style={{ marginRight: '15px', backgroundColor: '#17a2b8', color: 'white' }}
                >
                  {loading ? 'Retrying...' : 'Retry'}
                </button>
                <button
                  className="p-check-btn"
                  onClick={() => navigate("/")}
                >
                  Go to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (!orderData) {
    return null;
  }

  const order = orderData.order;
  const status = order?.status || 'processing';
  const paymentMethod = order?.paymentMethod || 'wallet';

  return (
    <Layout>
      <div className="productpage">
        <div className="pageheading">
          <span onClick={() => navigate("/")}>
            <ArrowBackIosIcon className="icon" />
            Go Back to Home
          </span>
          <h5>Order Status</h5>
        </div>

        <div className="order-status-container" style={{ padding: '20px' }}>
          {/* Status Icon and Message */}
          <div className="status-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
            {getStatusIcon(status)}
            <h3 style={{ color: getStatusColor(status), marginTop: '15px', marginBottom: '10px' }}>
              {getStatusText(status)}
            </h3>
            <p style={{ color: '#666', fontSize: '16px' }}>
              {orderData.message || 'Your order has been processed'}
            </p>
          </div>

          {/* Order Details */}
          <div className="section section4">
            <h6>Order Details</h6>
            <div className="purchase-confirmation">
              <div className="items">
                <div className="item">Order ID</div>
                <div className="item">{orderData.orderId || order?._id}</div>
              </div>
              
              {order?.items && order.items.length > 0 && (
                <>
                  <div className="items">
                    <div className="item">Item</div>
                    <div className="item">{order.items[0].itemName}</div>
                  </div>
                  <div className="items">
                    <div className="item">Quantity</div>
                    <div className="item">{order.items[0].quantity}</div>
                  </div>
                  <div className="items">
                    <div className="item">Price</div>
                    <div className="item">₹{order.items[0].price}</div>
                  </div>
                </>
              )}

              <div className="items">
                <div className="item">Payment Method</div>
                <div className="item">{paymentMethod === 'wallet' ? 'HV Wallet' : 'UPI'}</div>
              </div>

              <div className="items">
                <div className="item">Status</div>
                <div className="item" style={{ color: getStatusColor(status), fontWeight: 'bold' }}>
                  {status.toUpperCase()}
                </div>
              </div>

              {order?.createdAt && (
                <div className="items">
                  <div className="item">Order Date</div>
                  <div className="item">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
              )}

              {/* Player Details from Description */}
              {order?.description && (
                <>
                  <hr />
                  <h6 style={{ marginTop: '20px', marginBottom: '15px' }}>Player Details</h6>
                  {(() => {
                    try {
                      const desc = JSON.parse(order.description);
                      return (
                        <>
                          {desc.playerId && (
                            <div className="items">
                              <div className="item">Player ID</div>
                              <div className="item">{desc.playerId}</div>
                            </div>
                          )}
                          {desc.server && (
                            <div className="items">
                              <div className="item">Server</div>
                              <div className="item">{desc.server}</div>
                            </div>
                          )}
                        </>
                      );
                    } catch (e) {
                      return (
                        <div className="items">
                          <div className="item">Details</div>
                          <div className="item">{order.description}</div>
                        </div>
                      );
                    }
                  })()}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons" style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                className="p-check-btn"
                onClick={() => {
                  const orderId = searchParams.get('orderId') || searchParams.get('client_txn_id');
                  if (orderId) {
                    fetchOrderStatus(orderId);
                  }
                }}
                style={{ marginRight: '15px', backgroundColor: '#17a2b8', color: 'white' }}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Status'}
              </button>
              
              <button
                className="p-check-btn"
                onClick={() => navigate("/")}
                style={{ marginRight: '15px' }}
              >
                Continue Shopping
              </button>
              
              <button
                className="p-check-btn"
                onClick={() => navigate("/orders")}
                style={{ backgroundColor: '#f0f0f0', color: '#333' }}
              >
                View All Orders
              </button>
            </div>

            {/* Status-specific Messages */}
            {status === 'processing' && (
              <div className="status-message" style={{ 
                backgroundColor: '#fff7e6', 
                border: '1px solid #ffd591', 
                borderRadius: '8px', 
                padding: '15px', 
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#d48806' }}>
                  Your order is being processed. You will receive your diamonds shortly.
                </p>
              </div>
            )}

            {status === 'completed' && (
              <div className="status-message" style={{ 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '8px', 
                padding: '15px', 
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#389e0d' }}>
                  Congratulations! Your diamonds have been successfully delivered to your account.
                </p>
              </div>
            )}

            {status === 'failed' && (
              <div className="status-message" style={{ 
                backgroundColor: '#fff2f0', 
                border: '1px solid #ffccc7', 
                borderRadius: '8px', 
                padding: '15px', 
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#cf1322' }}>
                  Your order failed to process. Please contact support for assistance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderStatus;
