import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import "./PromoEvents.css";
import { eventAPI } from "../lib/api";
import { message } from "antd";

const PromoEvents = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [promos, setPromos] = useState(null);

  async function getPromos() {
    try {
      const response = await eventAPI.getEvents();
      const res = await response.json();
      if (res.success) {
        setPromos(res.data || res.events || []);
      } else {
        message.error(res.message || "Failed to load events");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to load events");
    }
  }

  useEffect(() => {
    getPromos();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="promo-event-container">
        <h4>Promo & Events</h4>
        <div className="promo-search">
          Filter By{" "}
          <input
            type="text"
            placeholder="Promo & Events"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="promo-filter-tabs">
          <button
            onClick={() => setFilter("All")}
            className={`${filter === "All" && "active"}`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter("Promo")}
            className={`${filter === "Promo" && "active"}`}
          >
            PROMO
          </button>
          <button
            onClick={() => setFilter("Events")}
            className={`${filter === "Events" && "active"}`}
          >
            EVENTS
          </button>
          <button
            onClick={() => setFilter("Esports")}
            className={`${filter === "Esports" && "active"}`}
          >
            ESPORTS
          </button>
        </div>

        <div className="promo-blogs-container">
          {promos
            ?.filter((item) => {
              if (filter !== "All" && item.category !== filter) {
                return false;
              }
              if (
                searchTerm &&
                !item.title.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return false;
              }
              return true;
            })
            .map((item, index) => (
              <div
                className="blog"
                onClick={() => navigate(`/promo/${item._id}`)}
                key={index}
              >
                <img src={item?.image} alt="" />
                <div className="content">
                  <span>
                    {new Date(item?.date).toLocaleString("default", {
                      day: "numeric",
                      long: "long",
                      year: "numeric",
                    })}{" "}
                    | {item?.category}
                  </span>
                  <h5>{item?.title}</h5>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default PromoEvents;
