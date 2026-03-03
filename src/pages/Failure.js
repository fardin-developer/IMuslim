import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import { ErrorOutline } from "@mui/icons-material";
import "./Failure.css";

const Failure = () => {
  return (
    <Layout>
      <div className="failure-container">
        <div className="failure-card">
          <div className="failure-icon">
            <ErrorOutline className="mui-failure-icon" />
          </div>
          <h2 className="failure-title">Order Failed!</h2>
          <p className="failure-message">
            Something went wrong while placing your order. Please try again or
            contact support.
          </p>
          <Link className="failure-button" to="/support">
            Contact Support
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Failure;
