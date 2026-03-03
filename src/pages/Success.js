import Layout from "../components/Layout/Layout";
import { Link, useLocation } from "react-router-dom";
import { CheckCircleOutline } from "@mui/icons-material";
import "./Success.css";

const Success = () => {
  const location = useLocation();
  return (
    <Layout>
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircleOutline className="mui-success-icon" />
          </div>
          <h2 className="success-title">
            {location.pathname === "/success"
              ? "Order Confirmed!"
              : "Payment Confirmed"}
          </h2>
          <p className="success-message">
            Thank you for your{" "}
            {location.pathname === "/success" ? "order" : "payment"}. You can
            track your {location.pathname === "/success" ? "order" : "payment"}{" "}
            status at any time.
          </p>
          <Link
            className="success-button"
            to={`${location.pathname === "/success" ? "/orders" : "/wallet"}`}
          >
            View My {location.pathname === "/success" ? "Orders" : "Payments"}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Success;
