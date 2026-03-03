import React from "react";
import Header from "../components/Header/Header";
import "./About.css";
import WeAre from "../components/About/WeAre";
import Text from "../components/About/Text";
import Layout from "../components/Layout/Layout";
import IMAGES from "../img/image";
import HowItWorks from "../components/Home/HowItWorks";

const About = () => {
  const about = [
    {
      h4: "WELCOME TO MOBI HAVEN – YOUR STYLISH TECH COMPANION!",
      p: "At Mobi Haven, we believe in merging fashion with technology, offering a unique range of mobile back skins that redefine your device's style. Our commitment lies in providing more than just protection; it's about expressing your individuality.",
    },
    {
      h4: "OUR VISION",
      p: "At MobiHeaven, our vision is simple yet powerful - to empower individuals to express themselves through their mobile devices. We believe that your phone should reflect your unique style, just like your clothing or home decor does. Our phone skins are the canvas for your creativity.",
    },
    {
      h4: "THE ART OF PHONE SKINS",
      p: "Our phone skins are not just protective covers; they are a statement of individuality. Each skin is meticulously designed and crafted to fit your device perfectly, ensuring both protection and aesthetic appeal. Whether you prefer minimalist elegance, vibrant patterns, or custom designs, we offer a diverse range of options to suit your taste.",
    },
    {
      h4: "OUR PROMISE",
      p: "We promise to continue innovating and bringing you the latest designs and trends in phone skins. With MobiHeaven, you're not just protecting your phone; you're making a style statement.",
    },
    {
      h4: "JOIN US IN ELEVATING YOUR PHONE'S STYLE",
      p: "We invite you to explore our extensive collection of phone skins and discover how you can elevate your phone's style effortlessly. Whether you own the latest flagship model or a classic device, MobiHeaven has the perfect skin to match your personality.",
    },
  ];

  const WhyMobiHeaven = () => {
    return (
      <div className="container why-choose-mobi-heaven">
        <h2 className="yline text-center w-100">
          <b>Why Choose Mobi Heaven?</b>
        </h2>
        <div className="mobi-heaven text-center">
          <img src={IMAGES?.m1} alt="" />
          <h4>Fashion Meets Function</h4>
          <p>
            Elevate your device's aesthetic with our trendy and functional
            mobile back skins. We blend cutting-edge designs with durable
            materials for a perfect fusion of style and protection.
          </p>
        </div>
        <div className="mobi-heaven text-center">
          <img src={IMAGES?.m2} alt="" />
          <h4>Unrivaled Variety</h4>
          <p>
            Discover an extensive collection of designs catering to diverse
            tastes. From classic elegance to pop culture references, our range
            ensures there's a perfect match for every style.
          </p>
        </div>
        <div className="mobi-heaven text-center">
          <img src={IMAGES?.m3} alt="" />
          <h4>Quality Assurance</h4>
          <p>
            Each Mobi Haven product undergoes rigorous quality checks, ensuring
            that you receive a top-notch accessory that not only looks great but
            also stands the test of time.
          </p>
        </div>
        <div className="mobi-heaven text-center">
          <img src={IMAGES?.m4} alt="" />
          <h4>Affordability Redefined</h4>
          <p>
            We believe in making style accessible. Enjoy affordable prices
            without compromising on quality. It's a win-win for your pocket and
            your device.
          </p>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container about-container">
        {about
          .map((item, index) => {
            return (
              <div className="mb-4">
                <h4>
                  <b>{item.h4}</b>
                </h4>
                <p>{item.p}</p>
              </div>
            );
          })
          .splice(0, 4)}
      </div>
      <WhyMobiHeaven />
      <div className="container about-container">
        {about
          .map((item, index) => {
            return (
              <div className="mb-4">
                <h4>
                  <b>{item.h4}</b>
                </h4>
                <p>{item.p}</p>
              </div>
            );
          })
          .splice(4, 6)}
      </div>
      <HowItWorks />
    </Layout>
  );
};

export default About;
