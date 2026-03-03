import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { authAPI } from "../lib/api";
import "./Register.css";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState(null);
  const [userEnteredOtp, setUserEnteredOtp] = useState(null);
  const [tab, setTab] = useState(0);
  const [pass, setPass] = useState(null);
  const [cpass, setCpass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.sendOTP(email, false);
      const res = await response.json();
      if (res.success) {
        message.success(res.message);
        setLoading(false);
        setMsg(true);
        setTab(1);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (userEnteredOtp === "") {
      return message.error("PLease enter otp");
    }
    if (!pass || !cpass) {
      return message.error("Please enter password");
    }
    if (pass !== cpass) {
      return message.error("Password doesnt match");
    }
    try {
      const response = await authAPI.verifyOTP(email, userEnteredOtp, false);
      const res = await response.json();
      if (res.success) {
        message.success(res.message);
        navigate("/login");
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="register-container">
        <div className="row">
          {tab === 0 && (
            <div className="form col-12 col-sm-12 col-md-6 col-lg-6 d-block m-auto">
              <h6 className="text-white">Dont worry! Get Otp on Your Email</h6>
              <hr className="text-white" />
              <div className="mb-3 form-fields">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Registered with us"
                  className="form-control"
                  type="text"
                  required
                />
              </div>
              <div className="mb-3">
                <button className="register-btn" onClick={handleSendOtp}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
              <div className="forgot-pass text-dark">
                <h6>
                  Not a User? <Link to="/register">click here</Link>
                </h6>
              </div>
            </div>
          )}
          {tab === 1 && (
            <div className="form col-12 col-sm-12 col-md-6 col-lg-6 d-block m-auto">
              <h6>Reset Your Password</h6>
              <hr />
              <div className="mb-3 form-fields">
                <label className="form-label" htmlFor="name">
                  Verify Your Otp
                </label>
                <input
                  onChange={(e) => setUserEnteredOtp(e.target.value)}
                  placeholder="Enter Otp"
                  className="form-control"
                  type="text"
                  required
                />
              </div>
              <div className="mb-3 form-fields">
                <label className="form-label" htmlFor="name">
                  Enter Password
                </label>
                <input
                  onChange={(e) => setPass(e.target.value)}
                  className="form-control"
                  type="text"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="mb-3 form-fields">
                <label className="form-label" htmlFor="name">
                  Confirm Password
                </label>
                <input
                  onChange={(e) => setCpass(e.target.value)}
                  className="form-control"
                  placeholder="Enter confirm password"
                  type="text"
                  required
                />
              </div>
              <div className="mb-3">
                <button className="register-btn" onClick={handleVerifyOtp}>
                  Verify & Update
                </button>
                {msg && (
                  <p className="text-center text-danger mt-2">
                    OTP is valid for 1 minute
                  </p>
                )}
              </div>
              <hr />
              <p>
                Not a User? <Link to="/register">click here</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPass;
