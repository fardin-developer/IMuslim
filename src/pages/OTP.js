import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    // Get login data from localStorage
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      try {
        const parsed = JSON.parse(loginData);
        setEmail(parsed.email);
        setIsPhoneLogin(parsed.isPhoneLogin || false);
      } catch (error) {
        // Silently handle parse error
      }
    } else {
      // If no login data, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      if (i < pastedData.length && /^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      message.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP(email, otpString, isPhoneLogin);
      const data = await response.json();

      // Check if request was successful
      if (response.ok) {
        // Check if OTP verification was successful
        // Handle both explicit success: true and implicit success (no success field but status 200)
        const isSuccess = data.success === true || (data.success !== false && response.status === 200);
        
        if (isSuccess) {
          const token = 
            data.token || 
            data.data?.token || 
            data.data?.authToken || 
            data.authToken ||
            data.data?.accessToken ||
            data.accessToken ||
            (data.data && typeof data.data === 'string' ? data.data : null);
          
          if (token && typeof token === 'string' && token.length > 0) {
            try {
              localStorage.setItem("authToken", token);
              localStorage.setItem("token", token);
              
              // Update auth context with user data
              if (data.user) {
                updateUser(data.user);
              }
            } catch (error) {
              if (error.name === 'QuotaExceededError') {
                message.error("Browser storage is full. Please clear some data and try again.");
              } else if (error.name === 'SecurityError') {
                message.error("localStorage is disabled. Please enable it in your browser settings.");
              } else {
                message.error("Failed to save token. Please check your browser settings.");
              }
            }
          } else {
            message.warning("Login successful but token not found. Please try logging in again.");
          }

          if (data.requiresRegistration || data.data?.requiresRegistration) {
            message.success("OTP verified. Please complete your registration.");
            setTimeout(() => navigate("/register"), 500);
          } else {
            localStorage.removeItem("loginData");
            message.success("Login successful!");
            
            const intendedPath = localStorage.getItem("intendedPath");
            setTimeout(() => {
              if (intendedPath) {
                localStorage.removeItem("intendedPath");
                navigate(intendedPath);
              } else {
                navigate("/");
              }
            }, 100);
          }
        } else {
          message.error(data.message || data.error || "Invalid OTP. Please try again.");
        }
      } else {
        message.error(data.message || data.error || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      message.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid register-container">
        <div className="row text-center" style={{ width: "100%", margin: "auto" }}>
          <div className="form d-block m-auto col-12 col-sm-12 col-md-6 col-lg-6">
            <form className="register-form">
              <h1 style={{ color: "white" }}>OTP Verification</h1>
              
              {/* Instructional Text */}
              <p className="mb-2" style={{ color: "white", fontSize: "13px" }}>
                Enter the OTP sent to
              </p>
              
              {/* Email Address */}
              <p className="fw-bold mb-4" style={{ color: "white", fontSize: "13px" }}>
                {email}
              </p>

              {/* OTP Input Fields */}
              <div className="d-flex justify-content-center gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="form-control text-center"
                    style={{
                      width: "45px",
                      height: "60px",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  />
                ))}
              </div>

              {/* Resend OTP Link */}
              <div className="text-center mb-4">
                <p style={{ color: "white", fontSize: "13px" }}>
                  Didn't you receive the OTP?{" "}
                  <Link 
                    to="/login" 
                    style={{ color: "var(--a)", textDecoration: "none", fontSize: "13px" }}
                  >
                    Resend OTP
                  </Link>
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.join("").length !== 6}
                className="register-btn w-100"
              >
                {isLoading ? "VERIFYING..." : "Log In"}
              </button>

              {/* Back to Login */}
              <div className="forgot-pass d-flex justify-content-center mt-3">
                <h6 className="text-dark text-center my-2">
                  <Link 
                    to="/login" 
                    style={{ color: "var(--a)", textDecoration: "underline" }}
                  >
                    Back to Login
                  </Link>
                </h6>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OTP;

