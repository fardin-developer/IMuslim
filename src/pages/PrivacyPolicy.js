import React from "react";
import Layout from "../components/Layout/Layout";
import "./Terms.css";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="bg-heading">
        <h4>
          <b>Privacy Policy</b>
        </h4>
      </div>
      <div className="terms-container">
        <p>Last updated: {new Date().toLocaleDateString("en-GB")}</p>
        <p>
          This Privacy Policy outlines how <b>ONESTEPLINK (OPC) PVT LTD</b>
          (operating as <b>imuslim</b> at <b>store.paymaxx.in</b>) collects, uses,
          and protects your information when you use our website.
        </p>
        <p>
          Registered Office: Palash Basti, House No451, Palash Basti Road, barsala, Bogipukhuri, Sonitpur, Alisinga, Assam, India, 784112.
        </p>

        <h5 className="mt-5">Information Collection:</h5>
        <p>
          - We gather personal data such as names, email addresses, phone numbers, and payment
          information exclusively to process your orders and provide a
          tailored experience.
        </p>

        <h5 className="mt-5">Usage of Information:</h5>
        <p>
          - The collected personal data is utilized to facilitate transactions,
          deliver purchased items, and improve the overall user
          experience within the website.
        </p>

        <h5 className="mt-5">Data Security:</h5>
        <p>
          - We use industry-standard security protocols to safeguard user
          information from unauthorized access, disclosure, alteration, or
          destruction.
        </p>

        <h5 className="mt-5">Third-Party Services:</h5>
        <p>
          - We engage third-party services (payment gateways) for payment processing and
          analytics. Users are encouraged to review the privacy policies of
          these services to understand their data handling practices.
        </p>

        <h5 className="mt-5">Cookies:</h5>
        <p>
          - Our website employs cookies to enhance the user experience. Users
          have the option to manage their cookie preferences through their
          browser settings.
        </p>

        <h5 className="mt-5">User Consent:</h5>
        <p>
          - By using our website and making purchases, users agree to
          the collection, processing, and storage of their personal information
          as described in this privacy policy.
        </p>

        <h5 className="mt-5">Data Retention:</h5>
        <p>
          - We retain user data for as long as necessary to meet the purposes
          outlined in this privacy policy, unless a longer retention period is
          mandated or permitted by law.
        </p>

        <h5 className="mt-5">Contact Information:</h5>
        <p>
          - For any privacy-related concerns or inquiries, users can reach out
          to us via our <Link to="/contact-us">Contact Us</Link> page.
        </p>
        <p>
          <i>
            By using our website and services, users agree to the terms outlined
            in this privacy policy.
          </i>
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
