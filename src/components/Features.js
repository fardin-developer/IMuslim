import React from "react";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FeedIcon from "@mui/icons-material/Feed";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import AddCardIcon from "@mui/icons-material/AddCard";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import "./Features.css";

const Features = () => {
  return (
    <div className="dgf-container">
      {/* <h5># Step into the World of Esports & Gaming</h5> */}
      <h1>How it works</h1>
      <div className="dgf-c">
        <div className="dgf">
          <LocalShippingIcon className="icon" />
          <h4>Instant Delivery</h4>
          <p>Get your items instantly, 24/7. website</p>
        </div>
        <div className="dgf">
          <SyncLockIcon className="icon" />
          <h4>Secure & Legit</h4>
          <p>Reliable and trusted services.</p>
        </div>
        <div className="dgf">
          <AddCardIcon className="icon" />
          <h4>Easy Payments</h4>
          <p>Flexible and secure options.</p>
        </div>
        <div className="dgf">
          <SupportAgentIcon className="icon" />
          <h4>24/7 Support</h4>
          <p>Always here to help you.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
