import React from "react";
import Layout from "../components/Layout/Layout";
import "./Terms.css";

const About = () => {
  return (
    <Layout>
      <div className="bg-heading">
        <h4>
          <b>About Us</b>
        </h4>
      </div>
      <div className="terms-container">
        <h5 className="mt-4">Welcome to imuslim!</h5>
        <p>
          Operated by <b>ONESTEPLINK (OPC) PVT LTD</b>, we are dedicated to bringing you the best products and services through our online platform <b>store.paymaxx.in</b>.
        </p>

        <h5 className="mt-5">Our Details</h5>
        <p>
          <b>Legal Entity Name:</b> ONESTEPLINK (OPC) PVT LTD<br />
          <b>Registered Address:</b> Palash Basti, House No451, Palash Basti Road, barsala, Bogipukhuri, Sonitpur, Alisinga, Assam, India, 784112<br />
        </p>

        <h5 className="mt-5">Our Mission</h5>
        <p>
          To provide high-quality and reliable services to our customers, ensuring a seamless and secure shopping experience on our platform. We aim to continually evolve and adapt to our customers' needs, delivering value through our extensive range of products.
        </p>

        <h5 className="mt-5">Why Choose Us?</h5>
        <ul>
          <li><strong>Secure Payments:</strong> We employ industry-standard security measures for all transactions.</li>
          <li><strong>Customer Satisfaction:</strong> Our primary goal is maintaining trust and providing excellent support for our users.</li>
          <li><strong>Quality Assurance:</strong> We ensure that you receive exactly what you paid for, in the promised timeframe.</li>
        </ul>
      </div>
    </Layout>
  );
};

export default About;
