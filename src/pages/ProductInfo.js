import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import { productAPI, orderAPI, authAPI } from "../lib/api";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import IMAGES from "../img/image.js";
import "./ProductInfo.css";

const ProductInfo = () => {
  const { _id: productId } = useParams();
  const navigate = useNavigate();
  const orderPanelRef = useRef(null);

  const [productData, setProductData] = useState(null);
  const [productMeta, setProductMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [createUserWithOtp, setCreateUserWithOtp] = useState(true);

  // Form State
  const [phone, setPhone] = useState("");
  const [phoneEntered, setPhoneEntered] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [paying, setPaying] = useState(false);

  /* ── Fetch product details ── */
  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await productAPI.getProductDetails(productId);
        const data = await res.json();
        if (data.success && data.productDetails?.length > 0) {
          setProductData(data.productDetails[0]);
          setProductMeta(data.productData);
          setCreateUserWithOtp(data.createUserWithoutOTP !== true);
        } else {
          message.error("Product not found.");
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const isDigital = productMeta?.digital ?? true;

  const scrollToOrder = () => {
    orderPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Get OTP ── */
  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10)
      return message.error("Please enter a valid 10-digit phone number.");
    try {
      setSendingOtp(true);
      const res = await authAPI.sendOTP(phone, true);
      const json = await res.json();
      if (json.success || json.message?.toLowerCase().includes("sent")) {
        setOtpSent(true);
        message.success("OTP sent to your phone!");
      } else {
        message.error(json.message || "Failed to send OTP.");
      }
    } catch {
      message.error("Server error. Please try again later.");
    } finally {
      setSendingOtp(false);
    }
  };

  /* ── Verify OTP ── */
  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) return message.error("Please enter a valid OTP.");
    setPhoneVerified(true);
    message.success("Phone verified! Please fill in your details.");
  };

  /* ── No-OTP: proceed after phone ── */
  const handlePhoneContinue = () => {
    if (!phone || phone.length !== 10)
      return message.error("Please enter a valid 10-digit phone number.");
    setPhoneEntered(true);
  };

  /* ── Place Order ── */
  const handlePay = async () => {
    const readyToPay = createUserWithOtp ? phoneVerified : phone.length === 10;
    if (!readyToPay) return message.error("Please enter a valid 10-digit phone number.");
    if (!name.trim()) return message.error("Please enter your full name.");

    try {
      setPaying(true);
      const payload = {
        productDetailsId: productData._id,
        quantity: 1,
        redirectUrl: `${window.location.origin}/order-status`,
        phone,
        name: name.trim(),
        email: email.trim(),
        ...(createUserWithOtp ? { otp } : {}),
      };

      const res = await orderAPI.createProductUPIOrder(payload);
      const json = await res.json();

      if (json.success) {
        if (json.token) localStorage.setItem("authToken", json.token);
        if (json.redirect_url) {
          const url = new URL(json.redirect_url);
          const txnId = url.searchParams.get("client_txn_id");
          if (txnId) { navigate(`/order-status?orderId=${txnId}`); return; }
        }
        if (json.transaction?.paymentUrl) {
          message.success("Redirecting to payment...");
          setTimeout(() => { window.location.href = json.transaction.paymentUrl; }, 400);
          return;
        }
        if (json.transaction?.orderId) { navigate(`/order-status?orderId=${json.transaction.orderId}`); return; }
        if (json.client_txn_id || json.udf1) { navigate(`/order-status?orderId=${json.client_txn_id || json.udf1}`); return; }
        message.error("Unexpected response. Please contact support.");
      } else {
        message.error(json.message || "Failed to place order.");
        if (json.message?.toLowerCase().includes("otp")) {
          setPhoneVerified(false);
          setOtp("");
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <Layout>
        <div className="pi-page">
          <button className="pi-back" onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{ fontSize: 14 }} /> Back
          </button>
          <div className="pi-grid">
            <div className="pi-left">
              <div className="pi-product-card pi-skeleton-card" />
              <div className="pi-card">
                <div className="pi-skel-line" style={{ width: "60%" }} />
                <div className="pi-skel-line" />
                <div className="pi-skel-line" style={{ width: "80%" }} />
              </div>
            </div>
            <div className="pi-right">
              <div className="pi-order-panel">
                <div className="pi-skel-line" style={{ height: 40 }} />
                <div className="pi-skel-line" style={{ marginTop: 16 }} />
                <div className="pi-skel-line" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!productData) {
    return (
      <Layout>
        <div className="pi-page">
          <button className="pi-back" onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{ fontSize: 14 }} /> Back
          </button>
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
            <p style={{ fontSize: 18 }}>Product details unavailable.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const readyToPay = createUserWithOtp ? phoneVerified : phoneEntered;

  return (
    <Layout>
      <div className="pi-page">
        <button className="pi-back" onClick={() => navigate(-1)}>
          <ArrowBackIosIcon sx={{ fontSize: 14 }} /> Back
        </button>

        <div className="pi-grid">
          {/* ═══════════ LEFT ═══════════ */}
          <div className="pi-left">

            {/* Hero Product Card */}
            <div className="pi-product-card">
              <div className="pi-islamic-deco" aria-hidden="true">
                <span>﷽</span>
              </div>
              <div className="pi-product-meta">
                <h1 className="pi-product-name">{productMeta?.name}</h1>
                {productData.shortDescription && (
                  <p className="pi-product-tagline">{productData.shortDescription}</p>
                )}
                <div className="pi-badges-row">
                  <span className="pi-type-badge">
                    {isDigital
                      ? <><BoltIcon sx={{ fontSize: 13 }} /> Instant Delivery</>
                      : <><LocalShippingIcon sx={{ fontSize: 13 }} /> Ships to You</>
                    }
                  </span>
                  <span className="pi-halal-badge">✔ Halal Certified</span>
                </div>
              </div>
            </div>

            {/* ── Product Image Gallery ── */}
            {(() => {
              const logos = Array.isArray(productData.logo)
                ? productData.logo.filter(Boolean)
                : productData.logo
                  ? [productData.logo]
                  : [];
              const fallback = `https://placehold.co/800x500?text=${encodeURIComponent(productMeta?.name || "Product")}`;
              const mainSrc = logos[activeImg] || fallback;
              return (
                <div className="pi-gallery">
                  {/* Main Image */}
                  <div className="pi-gallery-main">
                    <img
                      key={mainSrc}
                      src={mainSrc}
                      alt={`${productMeta?.name} — view ${activeImg + 1}`}
                      className="pi-gallery-main-img"
                      onError={(e) => { e.target.src = fallback; }}
                    />
                    {logos.length > 1 && (
                      <span className="pi-gallery-counter">{activeImg + 1} / {logos.length}</span>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {logos.length > 1 && (
                    <div className="pi-gallery-thumbs">
                      {logos.map((src, i) => (
                        <button
                          key={i}
                          className={`pi-gallery-thumb ${i === activeImg ? "pi-gallery-thumb-active" : ""}`}
                          onClick={() => setActiveImg(i)}
                          aria-label={`View image ${i + 1}`}
                        >
                          <img
                            src={src}
                            alt={`thumb ${i + 1}`}
                            onError={(e) => { e.target.src = fallback; }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Sadaqah Highlight */}
            <div className="pi-card" style={{
              backgroundColor: "#f0fdfa",
              borderLeft: "4px solid #0d9488",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{ fontSize: "24px" }}>🤲</span>
              <div>
                <strong style={{ color: "#0f766e", fontSize: "15px", display: "block", marginBottom: "4px" }}>Sadaqah Project</strong>
                <span style={{ color: "#115e59", fontSize: "14px", lineHeight: "1.4" }}>
                  15% of your purchase price is donated to help poor families.
                </span>
              </div>
            </div>

            {/* Description */}
            {productData.description && (
              <div className="pi-card">
                <h2 className="pi-card-title">About this Product</h2>
                <p className="pi-desc" style={{ whiteSpace: "pre-wrap" }}>{productData.description}</p>
              </div>
            )}

            {/* Bullet Points */}
            {productData.bulletPoints?.length > 0 && (
              <div className="pi-card">
                <h2 className="pi-card-title">What's Included</h2>
                <ul className="pi-features">
                  {productData.bulletPoints.map((pt, i) => (
                    <li key={i} className="pi-feature-item">
                      <CheckCircleIcon sx={{ fontSize: 17 }} className="pi-feature-icon" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Info */}
            {productData.importantInfo?.length > 0 && (
              <div className="pi-card pi-important-card">
                <h2 className="pi-card-title">
                  <InfoOutlinedIcon sx={{ fontSize: 17, verticalAlign: "middle", marginRight: "6px" }} />
                  Important Information
                </h2>
                <ul className="pi-features">
                  {productData.importantInfo.map((info, i) => (
                    <li key={i} className="pi-feature-item pi-info-item">
                      <span className="pi-info-dot" />
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Strip */}
            <div className="pi-trust-row">
              <div className="pi-trust-item">
                <ShieldIcon className="pi-trust-icon" />
                <span>Secure Payment</span>
              </div>
              <div className="pi-trust-item">
                <BoltIcon className="pi-trust-icon" />
                <span>Instant Delivery</span>
              </div>
              {isDigital && productData.downloadUrl && (
                <div className="pi-trust-item">
                  <DownloadIcon className="pi-trust-icon" />
                  <span>Instant Download</span>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════ RIGHT – Order Panel ═══════════ */}
          <div className="pi-right" ref={orderPanelRef}>
            <div className="pi-order-panel">

              {/* Price header */}
              <div className="pi-panel-header">
                <div>
                  <p className="pi-price-label">Total Price</p>
                  <div className="pi-price-hero">&#8377;{productData.price}</div>
                </div>
                <span className="pi-price-badge">{isDigital ? "Digital" : "Physical"}</span>
              </div>

              <div className="pi-divider" />

              {/* ── Phone (required) ── */}
              <div className="pi-field">
                <label className="pi-label">
                  Mobile Number <span className="pi-req">*</span>
                </label>
                {!(createUserWithOtp ? phoneVerified : false) ? (
                  <div className="pi-phone-row">
                    <span className="pi-prefix">🇮🇳 +91</span>
                    <input
                      type="tel"
                      className="pi-input pi-phone-inp"
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      disabled={otpSent && createUserWithOtp}
                    />
                  </div>
                ) : (
                  <div className="pi-verified-box">
                    <span>+91 {phone}</span>
                    <span className="pi-verified-badge">
                      <CheckCircleOutlineIcon sx={{ fontSize: 15 }} /> Verified
                    </span>
                  </div>
                )}
              </div>

              {/* OTP fields — only when OTP mode and OTP sent */}
              {createUserWithOtp && !phoneVerified && (
                <>
                  {!otpSent ? (
                    <button
                      className="pi-action-btn pi-full-btn"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || phone.length !== 10}
                    >
                      {sendingOtp ? <><span className="pi-spinner" /> Sending...</> : "Send OTP"}
                    </button>
                  ) : (
                    <div className="pi-field pi-fade-in">
                      <label className="pi-label">
                        Enter OTP <span className="pi-req">*</span>
                      </label>
                      <div className="pi-phone-row">
                        <input
                          type="text"
                          className="pi-input"
                          style={{ border: "none", background: "transparent", flex: 1 }}
                          placeholder="6-digit OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        />
                      </div>
                      <button
                        className="pi-action-btn pi-full-btn pi-action-verify"
                        style={{ marginTop: 8 }}
                        onClick={handleVerifyOtp}
                        disabled={otp.length < 4}
                      >
                        Verify OTP
                      </button>
                      <p className="pi-hint" style={{ textAlign: "center" }}>
                        Wrong number?{" "}
                        <span className="pi-link" onClick={() => { setOtpSent(false); setOtp(""); }}>
                          Change
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* ── Additional fields (grayed until phone ready) ── */}
              <div className={`pi-optional-fields ${(createUserWithOtp ? phoneVerified : phone.length === 10) ? "" : "pi-fields-locked"
                }`}>
                <div className="pi-field">
                  <label className="pi-label">
                    Full Name <span className="pi-req">*</span>
                  </label>
                  <input
                    type="text"
                    className="pi-input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={createUserWithOtp ? !phoneVerified : phone.length !== 10}
                  />
                </div>
                <div className="pi-field">
                  <label className="pi-label">
                    Email Address <span className="pi-optional-tag">optional</span>
                  </label>
                  <input
                    type="email"
                    className="pi-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={createUserWithOtp ? !phoneVerified : phone.length !== 10}
                  />
                  {isDigital && (
                    <p className="pi-hint">📩 Download link will be sent to this email</p>
                  )}
                </div>
              </div>

              {/* ── UPI logos ── */}
              <div className="pi-upi-row">
                <img src={IMAGES.upi} alt="UPI" className="pi-upi-logo" />
                <img src={IMAGES.gpay} alt="GPay" className="pi-upi-app" />
                <img src={IMAGES.phonepe} alt="PhonePe" className="pi-upi-app" />
                <img src={IMAGES.paytm} alt="Paytm" className="pi-upi-app" />
              </div>

              {/* ── BUY NOW ── always at bottom */}
              <button
                className="pi-pay-btn"
                onClick={handlePay}
                disabled={paying || (createUserWithOtp ? !phoneVerified : phone.length !== 10) || name.trim().length === 0}
              >
                {paying
                  ? <><span className="pi-spinner" /> Processing...</>
                  : <><ShoppingCartCheckoutIcon sx={{ fontSize: 20 }} /> Buy Now — ₹{productData.price}</>
                }
              </button>
              <p className="pi-secure-note">🔒 100% Secure · No hidden charges</p>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductInfo;
