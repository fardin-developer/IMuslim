import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { gameAPI } from "../lib/api";
import { useNavigate } from "react-router-dom";
import "./SearchContainer.css";

const SearchContainer = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState("");
  const [filterProduct, setFilterProduct] = useState(null);
  const [noResult, setNoResult] = useState(false);

  const handleFilterProduct = (e) => {
    const searchText = e.target.value.toLowerCase();
    setQuery(searchText);
  };

  useEffect(() => {
    const filteredProducts = products?.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilterProduct(filteredProducts);

    // Check for no results
    setNoResult(query !== "" && filteredProducts?.length === 0);
  }, [query, products]);

  const getAllProducts = async () => {
    try {
      const response = await gameAPI.getAllGames();
      const res = await response.json();
      if (res.success) {
        const games = res.games || res.data || [];
        setProducts(games.reverse());
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className={`search-container ${search ? "active" : ""}`}>
      <div className="search-tool">
        <SearchIcon className="icon" />
        <input
          placeholder="Search"
          type="text"
          onChange={handleFilterProduct}
        />
        <CloseIcon className="icon" onClick={() => setSearch(!search)} />
      </div>
      <hr />
      {query !== "" && (
        <div className="search-box">
          {filterProduct &&
            filterProduct?.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    navigate(`/product/${item?._id || item?.id || ''}`);
                    setSearch(!search);
                  }}
                  key={index}
                  className="product search-product"
                >
                  <img src={item.image} alt="" />
                  <div className="product-name">
                    <h6>{item?.name}</h6>
                  </div>
                </div>
              );
            })}
          <span className="text-center text-white">
            {noResult && <h2>No Result Found</h2>}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
