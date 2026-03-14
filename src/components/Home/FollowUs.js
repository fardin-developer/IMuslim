import React from "react";
import { Link } from "react-router-dom";
import IMAGES from "../../img/image";
import "./FollowUs.css";

const FollowUs = () => {
  return (
    <div className="followus-container">
      <h2>Reach Us At</h2>
      <div className="socials">
        <Link
          target="_blank"
          to="https://www.facebook.com/profile.php?id=61574096732822"
        >
          <img src={IMAGES.facebook} alt="" />
        </Link>

        <Link target="_blank" to="https://www.instagram.com/Islamic Store_offical">
          <img src={IMAGES.instagram} alt="" />
        </Link>

        <Link target="_blank" to="https://wa.me/9401410882">
          <img src={IMAGES.whatsapp} alt="" />
        </Link>

        {/* <Link target="_blank" to="https://t.me/clovershopindia">
          <img src={IMAGES.telegram} alt="" />
        </Link> */}

        <Link target="_blank" to="mailto:Islamic Storeup09@gmail.com">
          <img src={IMAGES.gmail} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default FollowUs;
