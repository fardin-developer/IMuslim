import React from "react";
import Slider from "react-slick";
import IMAGES from "../../img/image";
import "./Testimonials.css";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const Testimonials = () => {
  const agents = [
    {
      name: "Akira",
      desc: "I purchased Mobile Legends diamonds from this store and am highly satisfied with their prompt, affordable, and reliable services. Thanks!",
    },
    {
      name: "Naruto",
      desc: "Just made a purchase of Mobile Legends diamonds from this shop. Speedy, inexpensive, and reliable service. Thank you for the excellent experience!",
    },
    {
      name: "Shinchi",
      desc: "I highly recommend you guys to get topup from this store. Excellert and fast service. Go and get your work done. Hurry up!",
    },
  ];

  var settings = {
    dots: true,
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="testimonials-container">
      <span className="text-center d-block m-auto">
        <span className="text-green">
          <small>
            <b>Reviews</b>
          </small>
        </span>
        <h4>What People Say About Us</h4>
      </span>
      <div className="testimonial-slider">
        <Slider {...settings}>
          {agents?.map((agent, index) => {
            return (
              <div key={index} className="testimonial">
                <div className="testimonial-content">
                  <h6>{agent.name}</h6>
                  <span>
                    <small>{agent.desc}</small>
                  </span>
                  <FormatQuoteIcon className="icon" />
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
