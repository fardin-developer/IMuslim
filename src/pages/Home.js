import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import HeroSection from "../components/Home/HeroSection";
import HowItWorks from "../components/Home/HowItWorks";
import Products from "../components/Products";
import SliderText from "../components/Home/SliderText";
import Features from "../components/Features.js";
import { authAPI, bannerAPI } from "../lib/api";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import "./Home.css";

const Home = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [display, setDisplay] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [text, setText] = useState("");

  const getUserData = async () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await authAPI.getUserInfo();
      const res = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      // Silently handle errors
    }
  };

  // Notification API removed - endpoint not available
  // async function getNoti() {
  //   try {
  //     const response = await notificationAPI.getNotifications();
  //     const res = await response.json();
  //     if (res.success) {
  //       setImage(res.data[0].image);
  //       setLink(res.data[0].link);
  //       setDisplay(res.data[0].display);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  /* ── Capture affiliate code from URL and persist to localStorage ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const affFromUrl = params.get("aff");
    if (affFromUrl) {
      localStorage.setItem("affiliateCode", affFromUrl);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getUserData();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Popup display disabled since notification API is not available
  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowPopup(true);
  //   }, 1500);
  // }, []);



  // ============== SLDIE TEXT

  async function getSlideText() {
    try {
      const response = await bannerAPI.getSlideText();
      const res = await response.json();
      if (res.success) {
        setText(res.data.text);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // getSlideText();
  }, []);

  return (
    <Layout>
      <div className="main-home-container">
        {showPopup && display === "yes" && (
          <div className="popup-container">
            <Link target="_blank" to={link}>
              <img src={`/${image}`} alt="popup-img" />
            </Link>
            <div>
              <CancelIcon
                onClick={() => setShowPopup(!showPopup)}
                className="icon"
              />
            </div>
          </div>
        )}
        <HeroSection />


        <Products />

        {/* <HowItWorks /> */}
      </div>
    </Layout>
  );
};

export default Home;
