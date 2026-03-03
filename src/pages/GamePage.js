import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { gameAPI } from "../lib/api";
import "../components/Products.css";
import "./GamePage.css";

const GamePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getAllGames();
      const res = await response.json();
      if (res.success) {
        setGames(res.games || res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="game-page-container">
        <h4>Search Games</h4>
        <div className="game-search">
          <input
            type="text"
            placeholder="Type here.."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="game-container mobile-game-cont">
          {games
            ?.filter((item) => {
              if (
                searchTerm &&
                !item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
              ) {
                return false;
              }
              return true;
            })
            ?.map((product, index) => {
              return (
                <div
                  onClick={() => navigate(`/product/${product?._id || product?.id || ''}`)}
                  key={index}
                  className="product text-start"
                >
                  <div
                    className={`product-img-cont loading ${
                      loading && "active"
                    }`}
                  >
                    <img src={product?.image} alt={product?.name} />
                  </div>
                  <div className="product-name">
                    <p>{product?.name}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default GamePage;
