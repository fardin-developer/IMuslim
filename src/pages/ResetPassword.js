import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import { message } from "antd";

const ResetPassword = () => {
  const [email, setEmail] = useState(null);
  const [tab, setTab] = useState(0);

  const handleCheckOtp = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <Layout>
      <div className="container register-container">
        <div className="row">
          <div className="form col-12 col-sm-12 col-md-6 col-lg-6 d-block m-auto">
            <h6>Reset Your Password</h6>
            <hr />
            <div className="mb-3 form-fields">
              <label className="form-label" htmlFor="name">
                Enter Otp
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter 6 digits Otp"
                className="form-control"
                type="text"
                maxLength={6}
                required
              />
            </div>
            <div className="mb-3 register-btn">
              <button onClick={handleCheckOtp}>Verify Otp</button>
            </div>
            <hr />
            <p>
              Not a User? <Link to="/register">click here</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
