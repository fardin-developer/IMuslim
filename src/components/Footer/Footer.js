import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StickyFooter from "./StickyFooter";
import FollowUs from "../Home/FollowUs";
import IMAGES from "../../img/image";
import "../Footer/Footer.css";
import logo512 from "../../img/logo.webp";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  return (
    <React.Fragment>
      <div className="custom-shape-divider-bottom-167890">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="container-fluid footer-container">
        <div className="wa-icon-cont">
          <Link target="_blank" to="https://wa.me/916291886781">
            <img src={IMAGES.whatsapp} alt="WhatsApp" className="wa-img" />
          </Link>
        </div>

        <div className="footer-content-wrapper">
          {/* Brand and Social */}
          <div className="footer-main-section">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logo512} alt="Logo" width={100} className="glow-logo" />
              </div>
              <p className="footer-tagline">
                Top up your game in an instant. Epic wins, fast play, non-stop action! ✨
              </p>

              {/* Social Media */}
              <div className="footer-social-section">
                <h6 className="footer-social-heading">Connect With Us</h6>
                <div className="footer-socials">
                  <Link target="_blank" to="https://www.facebook.com/profile.php?id=61574096732822" className="social-link">
                    <img src={IMAGES.facebook} alt="Facebook" />
                  </Link>
                  <Link target="_blank" to="https://www.instagram.com/islamcicmlstore" className="social-link">
                    <img src={IMAGES.instagram} alt="Instagram" />
                  </Link>
                  <Link target="_blank" to="https://wa.me/916291886781" className="social-link">
                    <img src={IMAGES.whatsapp} alt="WhatsApp" />
                  </Link>
                  <Link target="_blank" to="mailto:havanaa1292@gmail.com" className="social-link">
                    <img src={IMAGES.gmail} alt="Email" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="footer-links-grid">
              <div className="footer-links-column">
                <h6 className="footer-heading">Quick Links</h6>
                <div className="heading-line"></div>
                <ul>
                  {user && (
                    <li>
                      <Link to="/user-dashboard">Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/orders">My Orders</Link>
                  </li>
                  <li>
                    <Link to="/wallet">Wallet</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h6 className="footer-heading">Legal</h6>
                <div className="heading-line"></div>
                <ul>
                  <li>
                    <Link to="/terms">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/refund-policy">Refund Policy</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h6 className="footer-heading">Payment Methods</h6>
                <div className="heading-line"></div>
                <div className="payment-channels">
                  <img src={IMAGES.paytm} alt="Paytm" />
                  <img src={IMAGES.phonepe} alt="PhonePe" />
                  <img src={IMAGES.gpay} alt="Google Pay" />
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} All Rights Reserved. Made with 💖
            </p>
          </div>
        </div>
      </div>
      <StickyFooter />
    </React.Fragment>
  );
};

export default Footer;
