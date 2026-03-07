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
  const [downloadProgress, setDownloadProgress] = useState(null);

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
  const downloadWithProgress = (url, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";

      const authToken = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (authToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
      }

      xhr.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        } else {
          onProgress(null);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const contentDisposition = xhr.getResponseHeader("content-disposition");
          resolve({ blob: xhr.response, contentDisposition });
        } else {
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const errorData = JSON.parse(reader.result);
              reject(new Error(errorData.error || errorData.message || "Download failed"));
            } catch (_) {
              reject(new Error("Download failed"));
            }
          };
          reader.readAsText(xhr.response);
        }
      };

      xhr.onerror = () => reject(new Error("Network error during download"));
      xhr.send();
    });
  };

  const handleDownload = async () => {
    const downloadLink = orderData?.order?.digitalDownload?.downloadLink;
    if (!downloadLink) return;

    const token = downloadLink.split("/order/download/")[1];
    if (!token) {
      // Fallback: open the link directly in a new tab
      window.open(downloadLink, "_blank");
      return;
    }

    const API_BASE_URL = 'https://api.imuslim.in/api/v1';
    const finalUrl = `${API_BASE_URL}/order/download/${token}`;

    try {
      setDownloading(true);
      setDownloadProgress(0);

      const { blob, contentDisposition } = await downloadWithProgress(
        finalUrl,
        (percent) => {
          if (percent !== null) setDownloadProgress(percent);
        }
      );

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

      const orderId =
        searchParams.get("orderId") ||
        searchParams.get("client_txn_id") ||
        searchParams.get("clientTrxId");
      if (orderId) fetchOrderStatus(orderId);
    } catch (err) {
      console.error("Download error:", err);
      const errorMsg = err.message || "Download failed. Please try again.";
      message.error(errorMsg);

      if (errorMsg === "This download link has already been used") {
        const orderId =
          searchParams.get("orderId") ||
          searchParams.get("client_txn_id") ||
          searchParams.get("clientTrxId");
        if (orderId) fetchOrderStatus(orderId);
      }
    } finally {
      setDownloading(false);
      setDownloadProgress(null);
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
        {isCompleted && isDigital && (
          <div className="os-download-card">
            <DownloadIcon className="os-download-icon" style={{ color: '#1a73e8', fontSize: '48px', marginBottom: '10px' }} />
            <h6 className="os-download-title">Your Digital Content is Ready</h6>
            <p className="os-download-desc">
              Access your purchased files instantly via Google Drive.
            </p>

            <a
              href={order?.digitalDownload?.googleDriveLink || order?.googleDriveLink || "https://drive.google.com/drive/folders/1KmHrd1WJ8PXmZxWrVF9wAmcNSomMfCID?usp=sharing"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#fff",
                backgroundColor: "#1a73e8",
                fontWeight: "600",
                textDecoration: "none",
                fontSize: "15px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(26, 115, 232, 0.35)",
                transition: "all 0.2s ease",
                marginTop: "4px"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1557b0"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a73e8"}
            >
              <DownloadIcon style={{ fontSize: "20px" }} />
              Access via Google Drive
            </a>

            {/* Download button temporarily disabled — re-enable when direct download is stable
            {hasDownload && !downloadUsed && (
              <>
                <button
                  className="os-download-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{ marginTop: "12px" }}
                >
                  <DownloadIcon style={{ fontSize: "18px" }} />
                  {downloading
                    ? downloadProgress != null
                      ? `Downloading… ${downloadProgress}%`
                      : "Downloading…"
                    : "Download Now"}
                </button>
                {downloading && downloadProgress != null && (
                  <div className="os-download-progress">
                    <div
                      className="os-download-progress-bar"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
              </>
            )}
            */}
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
