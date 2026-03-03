import React from "react";
import "./WeAre.css";
import IMAGES from "../../img/image";

const WeAre = () => {
  return (
    <div className="container we-are text-center mb-5 m-auto">
      <div className="row">
        <div className="we-logo col-12 col-sm-12 col-md-6 col-lg-6">
          <h1 className="caveat text-white">MyMuslimsaathi</h1>
        </div>
        <div className="px-4 d-block d-md-none d-lg-none">
          <hr className="m-0 p-0" />
        </div>
        <div className="we-content col-12 col-sm-12 col-md-6 col-lg-6">
          <h3>
            <b>
              Get Register<span style={{ color: "#26bd68" }}> Here</span>
            </b>
          </h3>
          <h3>
            <b>
              Search Our <span style={{ color: "#26bd68" }}>Database</span>
            </b>
          </h3>
          <h3>
            <b>
              Find A <span style={{ color: "#26bd68" }}>Match</span>
            </b>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WeAre;
