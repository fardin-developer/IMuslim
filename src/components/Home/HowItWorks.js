import React from "react";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LanguageIcon from "@mui/icons-material/Language";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useLocation } from "react-router-dom";
import "./HowItWorks.css";

const HowItWorks = () => {
  const location = useLocation();
  return (
    <div
      className={`container-fluid how-it-works ${
        location.pathname === "/games" && "bg-white"
      }`}
    >
      <div className="container before-footer">
        <div className="row">
          <div className="col-6">
            <LocalShippingIcon className="icon" />
            <h6 className="my-3 poppins">24/7 Instant Delivery</h6>
          </div>
          <div className="col-6">
            <SyncLockIcon className="icon" />
            <h6 className="my-3 poppins">100% Safe and Legitimate</h6>
          </div>
          <div className="col-6">
            <LanguageIcon className="icon" />
            <h6 className="my-3 poppins">Easy payment methods</h6>
          </div>
          <div className="col-6">
            <SupportAgentIcon className="icon" />
            <h6 className="my-3 poppins">24/7 Customer Support</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
