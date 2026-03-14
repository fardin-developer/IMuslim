import React from "react";
import Layout from "../components/Layout/Layout";
import "./Terms.css";

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="bg-heading">
        <h4>
          <b>Terms & Conditions</b>
        </h4>
      </div>
      <div className="terms-container">
        <p>
          Please read the following terms and conditions carefully before using
          our website (<b>store.paymaxx.in</b>) and services provided by <b>ONESTEPLINK (OPC) PVT LTD</b>.
        </p>
        <p>
          Registered Office: Palash Basti, House No451, Palash Basti Road, barsala, Bogipukhuri, Sonitpur, Alisinga, Assam, India, 784112.
        </p>

        <h5 className="mt-5">Acceptance of Terms:</h5>
        <p>
          - By accessing or using our website and services, you agree to comply
          with and be bound by these terms and conditions.
        </p>

        <h5 className="mt-5">Account Information:</h5>
        <p>
          - Users are responsible for maintaining the confidentiality of their
          account information, including login credentials. Any activity
          conducted under your account is your responsibility.
        </p>

        <h5 className="mt-5">Purchases & Payments:</h5>
        <p>
          - All purchases made through our website are subject to our refund policy. Users are solely
          responsible for all transactions made through their accounts. Prices for our products are subject to change without notice.
        </p>

        <h5 className="mt-5">Intellectual Property:</h5>
        <p>
          - All content on our website, including but not limited to text,
          graphics, logos, and images, is the property of ONESTEPLINK (OPC) PVT LTD and is protected
          by intellectual property laws.
        </p>

        <h5 className="mt-5">Prohibited Activities:</h5>
        <p>
          - Users must not engage in any unlawful or prohibited activities,
          including but not limited to hacking, data mining, or any actions that
          could disrupt the integrity of our services.
        </p>

        <h5 className="mt-5">Disclaimer of Warranties:</h5>
        <p>
          - Our services are provided "as is" without any warranty. We do not
          guarantee the accuracy, completeness, or reliability of our services.
        </p>

        <h5 className="mt-5">Limitation of Liability:</h5>
        <p>
          - ONESTEPLINK (OPC) PVT LTD and its affiliates are not liable for any direct, indirect,
          incidental, or consequential damages resulting from the use of our
          services.
        </p>

        <h5 className="mt-5">Modification of Terms:</h5>
        <p>
          - We reserve the right to modify these terms and conditions at any
          time. Your continued use of the website following the posting of any changes constitutes acceptance of those changes.
        </p>

        <h5 className="mt-5">Governing Law:</h5>
        <p>
          - These terms and conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Assam, India.
        </p>

        <p className="mt-5">
          <i>
            By using our website and services, you agree to abide by these terms
            and conditions. If you do not agree with any part of these terms,
            please refrain from using our services.
          </i>
        </p>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
