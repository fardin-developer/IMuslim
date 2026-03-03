import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { eventAPI } from "../lib/api";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./SinglePromoEvents.css";

const SinglePromoEvent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);

  async function getSinglePromo() {
    try {
      // Get all events and find the one matching the ID
      const response = await eventAPI.getEvents();
      const res = await response.json();
      if (res.success) {
        const events = res.data || res.events || [];
        const foundEvent = events.find((event) => event._id === params.id);
        if (foundEvent) {
          setPromo(foundEvent);
        } else {
          message.error("Event not found");
        }
      } else {
        message.error(res.message || "Failed to load event");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to load event");
    }
  }

  useEffect(() => {
    getSinglePromo();
  }, []);

  return (
    <Layout>
      <div className="single-promo-container">
        <ArrowLeftIcon className="icon" onClick={() => navigate("/promo")} />
        <div className="single-promo">
          <img src={promo?.image} alt="" />
          <div className="single-promo-content">
            <span>
              {new Date(promo?.date).toLocaleString("default", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              | {promo?.category}
            </span>
            <h2>{promo?.title}</h2>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: promo?.description }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePromoEvent;
