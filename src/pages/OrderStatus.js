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
import "./OrderStatus.css";

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
        const errorMsg = errData.error || errData.message || "Download failed. Please try again.";
        message.error(errorMsg);

        if (errorMsg === "This download link has already been used") {
          const orderId =
            searchParams.get("orderId") ||
            searchParams.get("client_txn_id") ||
            searchParams.get("clientTrxId");
          if (orderId) fetchOrderStatus(orderId);
        }
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
      <div className="os-page-wrapper">
        <div className="pi-back" onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
          <ArrowBackIosIcon style={{ fontSize: "14px" }} />
          Go Back
        </div>
        {children}
      </div>
    </Layout>
  );

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading && !orderData) {
    return (
      <PageWrapper>
        <div className="os-state-container">
          <div className="os-spinner"></div>
          <p style={{ color: "var(--pi-text-muted)", fontSize: "16px", fontWeight: "500" }}>Loading order details…</p>
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
        <div className="os-state-container">
          <ErrorIcon style={{ color: "#ff4d4f", fontSize: "64px", marginBottom: "16px" }} />
          <h3 style={{ color: "#ff4d4f", marginBottom: "8px", fontWeight: "800" }}>Order Not Found</h3>
          <p style={{ color: "var(--pi-text-muted)", marginBottom: "30px" }}>{error}</p>
          {orderId && (
            <div className="os-actions">
              <button
                className="os-btn-primary"
                onClick={() => fetchOrderStatus(orderId)}
                disabled={loading}
              >
                {loading ? "Retrying…" : "Retry"}
              </button>
              <button className="os-btn-secondary" onClick={() => navigate("/")}>
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
      <div className="os-container">

        {/* ── Status header ── */}
        <div className="os-header">
          <div className="os-status-icon">{getStatusIcon(status)}</div>
          <h3 className="os-status-title" style={{ color: getStatusColor(status) }}>
            {getStatusText(status)}
          </h3>
          <p className="os-status-subtitle">
            {orderData.message || "Your order has been processed"}
          </p>
        </div>

        {/* ── Digital download card (shown when applicable) ── */}
        {hasDownload && isCompleted && (
          <div className={`os-download-card ${downloadUsed ? "used" : ""}`}>
            {downloadUsed ? (
              <>
                <ErrorIcon className="os-download-icon" />
                <h6 className="os-download-title">Download Link Used</h6>
                <p className="os-download-desc">
                  You have already downloaded this file. Contact support if you need another download.
                  <br />
                  <span style={{ fontSize: "12px", marginTop: "4px", display: "inline-block" }}>
                    Error: This download link has already been used.
                  </span>
                </p>
                <button className="os-download-btn" disabled>
                  <DownloadIcon style={{ fontSize: "18px" }} />
                  Already Downloaded
                </button>
              </>
            ) : (
              <>
                <DownloadIcon className="os-download-icon" />
                <h6 className="os-download-title">Your Digital Content is Ready</h6>
                <p className="os-download-desc">
                  Click the button below to download your purchased digital content.
                </p>
                <button
                  className="os-download-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <DownloadIcon style={{ fontSize: "18px" }} />
                  {downloading ? "Preparing download…" : "Download Now"}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Order details ── */}
        <div className="os-details">
          <h6 className="os-details-title">Order Details</h6>

          <div className="os-detail-row">
            <span className="os-detail-label">Order ID</span>
            <span className="os-detail-value">{order?.orderId || order?._id}</span>
          </div>

          {order?.productName && (
            <div className="os-detail-row">
              <span className="os-detail-label">Product</span>
              <span className="os-detail-value">{order.productName}</span>
            </div>
          )}

          {order?.items?.length > 0 && (
            <>
              <div className="os-detail-row">
                <span className="os-detail-label">Quantity</span>
                <span className="os-detail-value">{order.items[0].quantity}</span>
              </div>
              <div className="os-detail-row">
                <span className="os-detail-label">Price</span>
                <span className="os-detail-value">₹{order.items[0].price}</span>
              </div>
            </>
          )}

          {order?.amount != null && (
            <div className="os-amount-row">
              <span className="os-amount-label">Total Amount</span>
              <span className="os-amount-value" style={{ float: 'right' }}>
                ₹{order.amount} {order.currency ? order.currency.toUpperCase() : ""}
              </span>
            </div>
          )}

          <div className="os-detail-row" style={{ marginTop: '8px' }}>
            <span className="os-detail-label">Payment Method</span>
            <span className="os-detail-value">{getPaymentLabel(order?.paymentMethod)}</span>
          </div>

          {order?.deliveryType && (
            <div className="os-detail-row">
              <span className="os-detail-label">Delivery Type</span>
              <span className="os-detail-value">{getDeliveryLabel(order.deliveryType)}</span>
            </div>
          )}

          <div className="os-detail-row">
            <span className="os-detail-label">Status</span>
            <span className="os-detail-value" style={{ color: getStatusColor(status) }}>
              {status.toUpperCase()}
            </span>
          </div>

          {order?.createdAt && (
            <div className="os-detail-row">
              <span className="os-detail-label">Order Date</span>
              <span className="os-detail-value">
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="os-actions">
          <button
            className="os-btn-secondary"
            onClick={() => {
              const orderId = searchParams.get("orderId") || searchParams.get("client_txn_id");
              if (orderId) fetchOrderStatus(orderId);
            }}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh Status"}
          </button>

          <button className="os-btn-primary" onClick={() => navigate("/")}>
            Continue Shopping
          </button>

          <button className="os-btn-secondary" onClick={() => navigate("/orders")}>
            View All Orders
          </button>
        </div>

        {/* ── Status-specific banners ── */}
        {status === "processing" && (
          <div className="os-message processing">
            ⏳ Your order is being processed. We'll notify you once it's ready.
          </div>
        )}

        {isCompleted && !isDigital && (
          <div className="os-message success">
            ✅ Your order has been confirmed and is on its way!
          </div>
        )}

        {isCompleted && isDigital && !hasDownload && (
          <div className="os-message success">
            ✅ Your digital purchase is confirmed. Check your email for access details.
          </div>
        )}

        {["failed", "error"].includes(status?.toLowerCase()) && (
          <div className="os-message error">
            ❌ Your order could not be processed. Please contact support for assistance.
          </div>
        )}

      </div>
    </PageWrapper>
  );
};

export default OrderStatus;
