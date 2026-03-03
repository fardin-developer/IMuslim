import React from "react";
import IMAGES from "../../img/image";
import { Link } from "react-router-dom";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="home-about-container">
      <div className="row">
        <div className="text-center home-about-left col-12 col-sm-12 col-md-6 col-lg-6">
          <img src={IMAGES.aboutImg} alt="" />
        </div>
        <div className="home-about-right col-12 col-sm-12 col-md-6 col-lg-6">
          <span>Know About</span>
          <h2>
            <b>Genius Gate Encouragement Quiz.</b>
          </h2>
          <p>
            Genius Gate: Fostering Young Talent with Cash Prizes, Scholarships,
            and Mentorship from ALLEN Career Institute. We believe in providing
            a platform that not only allows students to showcase their abilities
            and earn recognition but also prepares their minds for even greater
            achievements in the future."
          </p>
          <button className="hero-btn">
            <Link to="/about" className="text-dark">
              About Us
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
