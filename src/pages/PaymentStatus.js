import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import { transactionAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./PaymentStatus.css";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshBalance } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const clientTxnId = searchParams.get("client_txn_id") || searchParams.get("clientTxnId");
        const txnId = searchParams.get("txn_id") || searchParams.get("txnId");

        if (!clientTxnId) {
          message.error("Transaction ID not found");
          setLoading(false);
          return;
        }

        const response = await transactionAPI.getTransactionStatus(clientTxnId, txnId);
        const data = await response.json();

        if (response.ok && (data.success !== false)) {
          const paymentInfo = data.data || data.transaction || data;
          setPaymentData(paymentInfo);
          
          // Get the actual payment status from the transaction data
          const status = paymentInfo?.status || data.status;
          const paymentStatus = paymentInfo?.paymentStatus || paymentInfo?.payment_status;
          
          // Normalize status to lowercase for comparison
          const normalizedStatus = status?.toLowerCase() || '';
          const normalizedPaymentStatus = paymentStatus?.toLowerCase() || '';
          
          // Check for pending statuses first
          const isPaymentPending = 
            normalizedStatus === "pending" ||
            normalizedStatus === "processing" ||
            normalizedStatus === "initiated" ||
            normalizedStatus === "in_progress" ||
            normalizedPaymentStatus === "pending" ||
            normalizedPaymentStatus === "processing" ||
            normalizedPaymentStatus === "initiated";
          
          // Check for failure statuses
          const isPaymentFailed = 
            normalizedStatus === "failed" ||
            normalizedStatus === "failure" ||
            normalizedStatus === "fail" ||
            normalizedStatus === "cancelled" ||
            normalizedStatus === "canceled" ||
            normalizedStatus === "rejected" ||
            normalizedStatus === "declined" ||
            normalizedPaymentStatus === "failed" ||
            normalizedPaymentStatus === "failure" ||
            normalizedPaymentStatus === "fail";
          
          // Check for success statuses only if not pending and not failed
          const isPaymentSuccess = !isPaymentPending && !isPaymentFailed && (
            normalizedStatus === "success" || 
            normalizedStatus === "completed" || 
            normalizedStatus === "paid" ||
            normalizedStatus === "successful" ||
            normalizedPaymentStatus === "success" ||
            normalizedPaymentStatus === "completed" ||
            normalizedPaymentStatus === "paid"
          );

          setIsSuccess(isPaymentSuccess);
          setIsPending(isPaymentPending);
          
          // Refresh balance if payment is successful (for both UPI and wallet payments)
          if (isPaymentSuccess) {
            // Refresh balance and wait a bit to ensure it's updated
            refreshBalance().then(() => {
              // Balance refreshed successfully
            }).catch(() => {
              // Silently handle balance refresh errors
            });
          }
        } else {
          setIsSuccess(false);
          setIsPending(false);
          setPaymentData(null);
          message.error(data.message || "Failed to fetch payment status");
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setIsSuccess(false);
        setIsPending(false);
        message.error("Failed to fetch payment status");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [searchParams, refreshBalance]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="payment-status-container">
          <div className="payment-status-card">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Checking payment status...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="payment-status-container">
        <div className="payment-status-card">
          {/* Status Icon */}
          <div className={`status-icon ${
            isSuccess ? "success" : isPending ? "pending" : "failed"
          }`}>
            {isSuccess ? (
              <CheckCircleIcon className="status-icon-svg" />
            ) : isPending ? (
              <AccessTimeIcon className="status-icon-svg" />
            ) : (
              <CancelIcon className="status-icon-svg" />
            )}
          </div>

          {/* Status Title */}
          <h2 className="status-title">
            {isSuccess 
              ? "Payment Successful" 
              : isPending 
              ? "Payment Pending" 
              : "Payment Failed"}
          </h2>

          {/* Payment Details Card */}
          {paymentData && (
            <div className="payment-details-card">
              <div className="payment-detail-row">
                <span className="detail-label">Order ID</span>
                <span className="detail-value">
                  {paymentData.orderId || paymentData.order_id || paymentData.clientTxnId || paymentData.client_txn_id || "N/A"}
                </span>
              </div>
              <div className="payment-detail-row">
                <span className="detail-label">Payment Time</span>
                <span className="detail-value">
                  {formatDate(paymentData.createdAt || paymentData.created_at || paymentData.paymentTime || paymentData.payment_time)}
                </span>
              </div>
              {paymentData.gameName && (
                <div className="payment-detail-row">
                  <span className="detail-label">Game Name</span>
                  <span className="detail-value">{paymentData.gameName}</span>
                </div>
              )}
              {paymentData.userId && (
                <div className="payment-detail-row">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{paymentData.userId}</span>
                </div>
              )}
              {paymentData.zoneId && (
                <div className="payment-detail-row">
                  <span className="detail-label">Zone ID</span>
                  <span className="detail-value">{paymentData.zoneId}</span>
                </div>
              )}
              {paymentData.pack && (
                <div className="payment-detail-row">
                  <span className="detail-label">Pack</span>
                  <span className="detail-value">{paymentData.pack}</span>
                </div>
              )}
              {paymentData.amount && (
                <div className="payment-detail-row">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">₹{parseFloat(paymentData.amount).toFixed(2)}</span>
                </div>
              )}
              {paymentData.status && (
                <div className="payment-detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-badge ${paymentData.status.toLowerCase()}`}>
                    {paymentData.status}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="payment-action-buttons">
            <button
              className="btn-top-up"
              onClick={() => navigate("/wallet")}
            >
              Top Up Again
            </button>
            <button
              className="btn-back-home"
              onClick={() => navigate("/")}
            >
              Back To Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentStatus;

