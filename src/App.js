import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPass from "./pages/ForgotPass";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./user/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import GamePage from "./pages/GamePage";
import Search from "./pages/Search";
import ProductInfo from "./pages/ProductInfo";
import ProductCheckout from "./pages/ProductCheckout";
import OrderStatus from "./pages/OrderStatus";
import Loader from "./pages/Loader";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
import PromoEvents from "./pages/PromoEvents.js";
import SinglePromoEvent from "./pages/SinglePromoEvent.js";
import Success from "./pages/Success.js";
import Failure from "./pages/Failure.js";
import PaymentStatus from "./pages/PaymentStatus.js";
import Orders from "./user/Orders";
import Address from "./user/Address";
import Account from "./user/Account";
import ViewOrder from "./user/ViewOrder";
import Wallet from "./user/Wallet";
import Query from "./user/Query";
import Maintenance from "./user/Maintenance";
import { useEffect, useState } from "react";
import { message } from "antd";
import { AuthProvider } from "./context/AuthContext";

// google login
import { gapi } from "gapi-script";

function App() {
  const [website, setWebsite] = useState(true);
  const [loading, setLoading] = useState(false);

  const clientId = process.env.REACT_APP_CLIENTID;
  useEffect(() => {
    function start() {
      gapi.client.init({ clientId: clientId, scope: "" });
    }
    gapi.load("client:auth2", start);
  });

  // Removed getWebsite function - admin API removed
  // Website is always enabled now
  useEffect(() => {
    setWebsite(true);
    setLoading(false);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {loading ? (
          <Loader />
        ) : website ? (
          <Routes>
            {/* pages */}
            <Route path="/:token?" element={<Home />} />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/otp"
              element={
                <PublicRoute>
                  <OTP />
                </PublicRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* <Route path="/games" element={<GamePage />} /> */}
            <Route path="/search" element={<Search />} />
            <Route path="/product/:_id?" element={<ProductInfo />} />
            <Route
              path="/product-checkout"
              element={
                <ProtectedRoute>
                  <ProductCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status"
              element={
                <ProtectedRoute>
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status/success"
              element={
                <ProtectedRoute>
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status/failure"
              element={
                <ProtectedRoute>
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status/pending"
              element={
                <ProtectedRoute>
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route path="/promo" element={<PromoEvents />} />
            <Route path="/promo/:id?" element={<SinglePromoEvent />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/walletsuccess/:name?" element={<Success />} />
            <Route path="/success/:name?" element={<Success />} />
            <Route path="/failure/:name?" element={<Failure />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/query"
              element={
                <ProtectedRoute>
                  <Query />
                </ProtectedRoute>
              }
            />
            <Route
              path="/address"
              element={
                <ProtectedRoute>
                  <Address />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-order/:orderId?"
              element={
                <ProtectedRoute>
                  <ViewOrder />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/service" element={<Service />} /> */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<ContactUs />} />
            {/* ======================== USER PAGES =============================== */}
            {/* ========== EMAIL VERIFY */}
            <Route
              path="/user-dashboard/:token?"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* ======================== USER PAGES =============================== */}
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Maintenance />} />
            <Route path="*" element={<Maintenance />} />
          </Routes>
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
