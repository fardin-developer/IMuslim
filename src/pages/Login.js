import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import { authAPI } from "../lib/api";
import "./Register.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // const [isPhoneLogin, setIsPhoneLogin] = useState(true); // Commented out - phone login only
  const isPhoneLogin = true; // Always phone login
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSendOTP = async () => {
    if (!email.trim()) {
      message.error("Please enter your phone number");
      return;
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedPhone = email.trim().replace(/\D/g, ""); // Remove non-digits
    if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
      message.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Email validation (commented out - phone login only)
    // if (!isPhoneLogin) {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(email.trim())) {
    //     message.error("Please enter a valid email address");
    //     return;
    //   }
    // }

    setIsLoading(true);
    try {
      const response = await authAPI.sendOTP(email, isPhoneLogin);
      const data = await response.json();

      if (response.ok) {
        message.success("OTP sent successfully!");
        // Store email/phone for OTP verification
        localStorage.setItem(
          "loginData",
          JSON.stringify({
            email: email,
            isPhoneLogin: isPhoneLogin,
          })
        );
        navigate("/otp");
      } else {
        message.error(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      message.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <div className="container-fluid register-container auth-container">
        <div className="row text-center" style={{ width: "100%", margin: "auto" }}>
          <div className="form d-block m-auto col-12 col-sm-12 col-md-6 col-lg-6">
            <form className="register-form">
              <h1 style={{ color: "#967563", fontWeight: "600" }}>Sign In</h1>
              <div className="form-fields mb-3">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(""); // Clear error on input change
                  }}
                  onBlur={() => {
                    if (email.trim()) {
                      const phoneRegex = /^[6-9]\d{9}$/;
                      const cleanedPhone = email.trim().replace(/\D/g, "");
                      if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
                        setEmailError("Please enter a valid 10-digit phone number");
                      } else {
                        setEmailError("");
                      }
                    }
                    // Email validation (commented out - phone login only)
                    // if (!isPhoneLogin) {
                    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    //   if (!emailRegex.test(email.trim())) {
                    //     setEmailError("Please enter a valid email address");
                    //   } else {
                    //     setEmailError("");
                    //   }
                    // }
                  }}
                  className={`form-control ${emailError ? "is-invalid" : ""}`}
                />
                {emailError && (
                  <div className="text-danger mt-1" style={{ fontSize: "12px", textAlign: "left" }}>
                    {emailError}
                  </div>
                )}
              </div>

              {/* Remember me */}
              <div className="d-flex justify-content-between mb-3">
                <label className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="me-2"
                  />
                  <span style={{ color: "#B0B0B0", fontSize: "13px" }}>Remember me</span>
                </label>
                {/* Email login option (commented out - phone login only) */}
                {/* <button
                  type="button"
                  onClick={() => {
                    setIsPhoneLogin(!isPhoneLogin);
                    setEmail("");
                    setEmailError(""); // Clear error when switching modes
                  }}
                  className="btn btn-link p-0"
                  style={{ textDecoration: "none", color: "var(--a)" , fontSize : "13px"}}
                >
                  {isPhoneLogin
                    ? "Login with email?"
                    : "Login with number?"}
                </button> */}
              </div>

              {/* Send OTP Button */}
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="register-btn w-100"
              >
                {isLoading ? "SENDING OTP..." : "Send OTP"}
              </button>

              {/* Register Link */}
              <div className="text-center mt-3">
                <p style={{ color: "#B0B0B0", fontSize: "14px", margin: "0" }}>
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    style={{
                      color: "#967563",
                      cursor: "pointer",
                      fontWeight: "600",
                      textDecoration: "underline"
                    }}
                  >
                    Click here to register
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
