import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { message } from "antd";
import { orderAPI } from "../lib/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DownloadIcon from "@mui/icons-material/Download";
import "./ProductInfo.css";

const OrderStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

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
    } catch (err) {
      console.error("Error fetching order status:", err);
      const errorMessage = "Failed to fetch order status";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderId =
      searchParams.get("orderId") ||
      searchParams.get("client_txn_id") ||
      searchParams.get("clientTrxId");

    if (orderId) {
      fetchOrderStatus(orderId);
    } else {
      message.error("No order ID found");
    }
  }, [searchParams]);

  // ── Download digital goods ──────────────────────────────────────────────────
  const handleDownload = async () => {
    const downloadLink = orderData?.order?.digitalDownload?.downloadLink;
    if (!downloadLink) return;

    // The download link is a full URL like:
    // https://api.imuslim.in/api/v1/order/download/<token>
    // We hit it via our authenticated apiCall wrapper to attach JWT.
    const token = downloadLink.split("/order/download/")[1];
    if (!token) {
      // Fallback: open the link directly in a new tab
      window.open(downloadLink, "_blank");
      return;
    }

    try {
      setDownloading(true);
      const response = await orderAPI.downloadDigitalOrder(token);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        message.error(errData.message || "Download failed. Please try again.");
        return;
      }

      // Stream the blob and trigger a browser download
      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "download";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      message.success("Download started successfully!");
      // Refresh so the UI reflects downloadUsed = true
      const orderId =
        searchParams.get("orderId") ||
        searchParams.get("client_txn_id") ||
        searchParams.get("clientTrxId");
      if (orderId) fetchOrderStatus(orderId);
    } catch (err) {
      console.error("Download error:", err);
      message.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // ── Status helpers ──────────────────────────────────────────────────────────
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircleIcon style={{ color: "#52c41a", fontSize: "48px" }} />;
      case "failed":
      case "error":
        return <ErrorIcon style={{ color: "#ff4d4f", fontSize: "48px" }} />;
      default:
        return <HourglassEmptyIcon style={{ color: "#faad14", fontSize: "48px" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "#52c41a";
      case "failed":
      case "error":
        return "#ff4d4f";
      default:
        return "#faad14";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "Order Completed Successfully";
      case "failed":
      case "error":
        return "Order Failed";
      case "processing":
        return "Order is Being Processed";
      case "pending":
        return "Payment Pending";
      default:
        return "Order Status Unknown";
    }
  };

  const getDeliveryLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "digital":
        return "Digital Delivery";
      case "physical":
        return "Physical Delivery";
      default:
        return type || "—";
    }
  };

  const getPaymentLabel = (method) => {
    switch (method?.toLowerCase()) {
      case "upi":
        return "UPI";
      case "wallet":
        return "Wallet";
      case "card":
        return "Card";
      default:
        return method || "—";
    }
  };

  // ── Shared page skeleton ────────────────────────────────────────────────────
  const PageWrapper = ({ children }) => (
    <Layout>
      <div className="productpage">
        <div className="pageheading">
          <span onClick={() => navigate("/")}>
            <ArrowBackIosIcon className="icon" />
            Go Back
          </span>
          <h5>Order Status</h5>
        </div>
        {children}
      </div>
    </Layout>
  );

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading && !orderData) {
    return (
      <PageWrapper>
        <div className="loading-container" style={{ textAlign: "center", padding: "50px" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "15px", color: "#666" }}>Loading order details…</p>
        </div>
      </PageWrapper>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error && !orderData) {
    const orderId =
      searchParams.get("orderId") || searchParams.get("client_txn_id");
    return (
      <PageWrapper>
        <div className="error-container" style={{ textAlign: "center", padding: "50px" }}>
          <ErrorIcon style={{ color: "#ff4d4f", fontSize: "48px", marginBottom: "20px" }} />
          <h3 style={{ color: "#ff4d4f", marginBottom: "15px" }}>Order Not Found</h3>
          <p style={{ color: "#666", marginBottom: "30px" }}>{error}</p>
          {orderId && (
            <div style={{ marginTop: "20px" }}>
              <button
                className="p-check-btn"
                onClick={() => fetchOrderStatus(orderId)}
                disabled={loading}
                style={{ marginRight: "15px", backgroundColor: "#17a2b8", color: "white" }}
              >
                {loading ? "Retrying…" : "Retry"}
              </button>
              <button className="p-check-btn" onClick={() => navigate("/")}>
                Go to Home
              </button>
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  if (!orderData) return null;

  const order = orderData.order;
  const status = order?.status || "processing";
  const isCompleted = ["completed", "success"].includes(status?.toLowerCase());
  const isDigital = order?.deliveryType?.toLowerCase() === "digital";
  const digitalDownload = order?.digitalDownload;
  const hasDownload = isDigital && digitalDownload?.downloadLink;
  const downloadUsed = digitalDownload?.downloadUsed;

  // Parse description safely
  let parsedDesc = null;
  try {
    parsedDesc = JSON.parse(order?.description || "{}");
  } catch (_) { }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <div className="order-status-container" style={{ padding: "20px" }}>

        {/* ── Status header ── */}
        <div
          className="status-header"
          style={{ textAlign: "center", marginBottom: "30px" }}
        >
          {getStatusIcon(status)}
          <h3
            style={{
              color: getStatusColor(status),
              marginTop: "15px",
              marginBottom: "10px",
            }}
          >
            {getStatusText(status)}
          </h3>
          <p style={{ color: "#666", fontSize: "16px" }}>
            {orderData.message || "Your order has been processed"}
          </p>
        </div>

        {/* ── Digital download card (shown when applicable) ── */}
        {hasDownload && isCompleted && (
          <div
            style={{
              background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
              border: "1.5px solid #a5d6a7",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <DownloadIcon
              style={{ color: "#388e3c", fontSize: "36px", marginBottom: "8px" }}
            />
            <h6 style={{ color: "#2e7d32", marginBottom: "6px" }}>
              Your Digital Content is Ready
            </h6>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "16px" }}>
              {downloadUsed
                ? "You have already downloaded this file. Contact support if you need another download."
                : "Click the button below to download your purchased digital content."}
            </p>
            <button
              className="p-check-btn"
              onClick={handleDownload}
              disabled={downloading}
              style={{
                backgroundColor: "#2e7d32",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                opacity: downloading ? 0.7 : 1,
              }}
            >
              <DownloadIcon style={{ fontSize: "18px" }} />
              {downloading ? "Preparing download…" : "Download Now"}
            </button>
            {downloadUsed && (
              <p style={{ color: "#888", fontSize: "12px", marginTop: "10px" }}>
                ⚠️ One-time download already used
              </p>
            )}
          </div>
        )}

        {/* ── Order details ── */}
        <div className="section section4">
          <h6>Order Details</h6>
          <div className="purchase-confirmation">

            {/* Order ID */}
            <div className="items">
              <div className="item">Order ID</div>
              <div className="item" style={{ wordBreak: "break-all", fontSize: "13px" }}>
                {order?.orderId || order?._id}
              </div>
            </div>

            {/* Product name */}
            {order?.productName && (
              <div className="items">
                <div className="item">Product</div>
                <div className="item">{order.productName}</div>
              </div>
            )}

            {/* Items */}
            {order?.items?.length > 0 && (
              <>
                <div className="items">
                  <div className="item">Item</div>
                  <div className="item" style={{ fontSize: "13px" }}>
                    {order.items[0].itemName}
                  </div>
                </div>
                <div className="items">
                  <div className="item">Quantity</div>
                  <div className="item">{order.items[0].quantity}</div>
                </div>
                <div className="items">
                  <div className="item">Price</div>
                  <div className="item">
                    ₹{order.items[0].price}
                  </div>
                </div>
              </>
            )}

            {/* Total amount */}
            {order?.amount != null && (
              <div className="items">
                <div className="item" style={{ fontWeight: "600" }}>Total Amount</div>
                <div className="item" style={{ fontWeight: "600" }}>
                  ₹{order.amount} {order.currency ? order.currency.toUpperCase() : ""}
                </div>
              </div>
            )}

            {/* Payment method */}
            <div className="items">
              <div className="item">Payment Method</div>
              <div className="item">{getPaymentLabel(order?.paymentMethod)}</div>
            </div>

            {/* Delivery type */}
            {order?.deliveryType && (
              <div className="items">
                <div className="item">Delivery Type</div>
                <div className="item">{getDeliveryLabel(order.deliveryType)}</div>
              </div>
            )}

            {/* Status */}
            <div className="items">
              <div className="item">Status</div>
              <div
                className="item"
                style={{ color: getStatusColor(status), fontWeight: "bold" }}
              >
                {status.toUpperCase()}
              </div>
            </div>

            {/* Date */}
            {order?.createdAt && (
              <div className="items">
                <div className="item">Order Date</div>
                <div className="item">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}

            {/* Description text (if any) */}
            {parsedDesc?.text && (
              <>
                <hr />
                <div className="items" style={{ alignItems: "flex-start" }}>
                  <div className="item">Description</div>
                  <div className="item" style={{ fontSize: "13px", color: "#555" }}>
                    {parsedDesc.text}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Action buttons ── */}
          <div
            className="action-buttons"
            style={{ marginTop: "30px", textAlign: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}
          >
            <button
              className="p-check-btn"
              onClick={() => {
                const orderId =
                  searchParams.get("orderId") ||
                  searchParams.get("client_txn_id");
                if (orderId) fetchOrderStatus(orderId);
              }}
              style={{ backgroundColor: "#17a2b8", color: "white" }}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh Status"}
            </button>

            <button
              className="p-check-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>

            <button
              className="p-check-btn"
              onClick={() => navigate("/orders")}
              style={{ backgroundColor: "#f0f0f0", color: "#333" }}
            >
              View All Orders
            </button>
          </div>

          {/* ── Status-specific banners ── */}
          {status === "processing" && (
            <div
              className="status-message"
              style={{
                backgroundColor: "#fff7e6",
                border: "1px solid #ffd591",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, color: "#d48806" }}>
                ⏳ Your order is being processed. We'll notify you once it's ready.
              </p>
            </div>
          )}

          {isCompleted && !isDigital && (
            <div
              className="status-message"
              style={{
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, color: "#389e0d" }}>
                ✅ Your order has been confirmed and is on its way!
              </p>
            </div>
          )}

          {isCompleted && isDigital && !hasDownload && (
            <div
              className="status-message"
              style={{
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, color: "#389e0d" }}>
                ✅ Your digital purchase is confirmed. Check your email for access details.
              </p>
            </div>
          )}

          {["failed", "error"].includes(status?.toLowerCase()) && (
            <div
              className="status-message"
              style={{
                backgroundColor: "#fff2f0",
                border: "1px solid #ffccc7",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, color: "#cf1322" }}>
                ❌ Your order could not be processed. Please contact support for assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderStatus;
