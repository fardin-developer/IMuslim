import React from "react";
import Layout from "../components/Layout/Layout";
import "./Terms.css";

const ContactUs = () => {
    return (
        <Layout>
            <div className="bg-heading">
                <h4>
                    <b>Contact Us</b>
                </h4>
            </div>
            <div className="terms-container">
                <p>
                    Have a question, concern, or feedback? We’re here to help!
                </p>
                <p>
                    You may contact us using the information below:
                </p>

                <div className="mt-5">
                    <p><b>Merchant Legal entity name:</b> ONESTEPLINK (OPC) PVT LTD</p>
                    <p>
                        <b>Registered Address:</b><br />
                        Palash Basti, House No451, Palash Basti Road, barsala,<br />
                        Bogipukhuri, Sonitpur, Alisinga, Assam,<br />
                        India, 784112
                    </p>
                    <p>
                        <b>Operational Address:</b><br />
                        Palash Basti, House No451, Palash Basti Road, barsala,<br />
                        Bogipukhuri, Sonitpur, Alisinga, Assam,<br />
                        India, 784112
                    </p>
                </div>

                <div className="mt-5">
                    <p>For support and inquiries, please email us or reach out via our platform tools.</p>
                </div>
            </div>
        </Layout>
    );
};

export default ContactUs;
