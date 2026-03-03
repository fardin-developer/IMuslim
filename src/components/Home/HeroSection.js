import React, { useEffect, useRef, useState } from "react";
import { message } from "antd";
import Slider from "react-slick";
import { bannerAPI } from "../../lib/api";
import "./HeroSection.css";
import website from "../../website/data";

const HeroSection = () => {
  const arrowRef = useRef();
  const [banners, setBanners] = useState([]);
  const [secondaryBanners, setSecondaryBanners] = useState([]);

  var settings = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  async function getBanners() {
    try {
      const response = await bannerAPI.getBanners();
      const res = await response.json();
      if (res.success) {
        // Separate banners by type
        const primary = res.data.filter(b => b.type === 'primary banner' || b.type === 'primary');
        const secondary = res.data.filter(b => b.type === 'secondary banner' || b.type === 'secondary');

        // If neither have specific types, just fallback everything to primary
        if (primary.length === 0 && secondary.length === 0) {
          setBanners(res.data);
        } else {
          setBanners(primary.length > 0 ? primary : res.data);
          setSecondaryBanners(secondary);
        }
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <>
      <div className="container-fluid hero-container">
        {/* Primary Banners Slider */}
        {banners.length > 0 && (
          <Slider ref={arrowRef} {...settings}>
            {banners.map((item, index) => {
              const imageUrl = item?.image?.startsWith('http://') || item?.image?.startsWith('https://')
                ? item?.image
                : `${website.link}/${item?.image}`;

              return (
                <div key={index} className="banner">
                  <div className="image">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <img src={imageUrl} alt={item.title || "banner"} />
                      </a>
                    ) : (
                      <img src={imageUrl} alt={item.title || "banner"} />
                    )}
                  </div>
                </div>
              );
            })}
          </Slider>
        )}
      </div>
    </>
  );
};

export default HeroSection;
