import React from "react";
import Layout from "../components/Layout/Layout";
import "./Terms.css";

const RefundPolicy = () => {
  return (
    <Layout>
      <section className="bg-heading">
        <h4>
          <b>Refund / Cancellation Policy</b>
        </h4>
      </section>
      <section className="terms-container">
        <p>
          This Refund/Cancellation Policy governs the manner in which <b>ONESTEPLINK (OPC) PVT LTD</b> handles refunds and cancellations for products purchased on <b>store.paymaxx.in</b>.
        </p>
        <p>
          Registered Office: Palash Basti, House No451, Palash Basti Road, barsala, Bogipukhuri, Sonitpur, Alisinga, Assam, India, 784112.
        </p>

        <h5 className="mt-5">Order Cancellations</h5>
        <p>
          - Orders can be cancelled before they are processed or shipped. To request a cancellation, please contact us immediately.
        </p>
        <p>
          - Once an order has been completed or dispatched, it cannot be cancelled but may be eligible for a refund under our refund policy.
        </p>

        <h5 className="mt-5">Refund Eligibility</h5>
        <p>
          - Refunds will only be considered for products that are defective, significantly not as described, or if there was an unauthorized transaction.
        </p>
        <p>
          - Refunds will not be processed if incorrect account details or shipping information are provided by the user.
        </p>

        <h5 className="mt-5">Refund Process</h5>
        <p>
          - Users should submit refund requests via our Contact Us page.
        </p>
        <p>
          - Provide the transaction details, including the order number, date of
          purchase, and a detailed explanation of the issue with supporting evidence (such as screenshots).
        </p>

        <h5 className="mt-5">Refund Approval</h5>
        <p>- Refunds are subject to our team's approval and require investigation.</p>
        <p>
          - We reserve the right to refuse a refund if we determine the purchase was not made
          in good faith or the item was consumed/used.
        </p>

        <h5 className="mt-5">Refund Methods & Timelines</h5>
        <p>
          - Approved refunds will be processed using the original payment
          method (e.g., Credit Card, UPI, Net Banking) typically within 5-7 business days depending on your bank's processing time.
        </p>

        <h5 className="mt-5">Policy Changes</h5>
        <p>
          - We reserve the right to update or modify the refund policy at any
          time. Users will be notified of any significant changes.
        </p>

        <p className="mt-5">
          <i>
            By using our website and making purchases, users acknowledge
            and agree to abide by this refund/cancellation policy.
          </i>
        </p>
      </section>
    </Layout>
  );
};

export default RefundPolicy;
