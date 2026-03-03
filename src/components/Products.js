import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../lib/api";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DevicesIcon from "@mui/icons-material/Devices";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import "./Products.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      const res = await response.json();
      if (res.success) {
        const active = (res.products || []).filter(
          (p) => p.status === "active"
        );
        setProducts(active);
        const cats = ["All", ...new Set(active.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const filtered =
    products &&
    (filter === "All" ? products : products.filter((p) => p.category === filter));

  const skeletonCount = 6;

  return (
    <div className="ecom-products-container">
      {/* Header */}
      <div className="ecom-header">
        <div className="ecom-title-wrap">
          <StorefrontIcon className="ecom-title-icon" />
          <h2 className="ecom-title">Our Products</h2>
        </div>
        <p className="ecom-subtitle">Discover our curated collection</p>
        <div className="ecom-divider" />
      </div>

      {/* Category filters */}
      {categories.length > 1 && (
        <div className="ecom-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`ecom-filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="ecom-grid">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="ecom-card ecom-skeleton">
              <div className="ecom-card-img-wrap skeleton-img" />
              <div className="ecom-card-body">
                <div className="skeleton-line short" />
                <div className="skeleton-line long" />
                <div className="skeleton-line medium" />
              </div>
            </div>
          ))
          : filtered && filtered.length > 0
            ? filtered.map((product) => (
              <div
                key={product._id}
                className="ecom-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Badge */}
                <div className={`ecom-badge ${product.digital ? "digital" : "physical"}`}>
                  {product.digital ? (
                    <>
                      <DevicesIcon style={{ fontSize: 12 }} /> Digital
                    </>
                  ) : (
                    <>
                      <LocalShippingIcon style={{ fontSize: 12 }} /> Physical
                    </>
                  )}
                </div>

                {/* Image */}
                <div className="ecom-card-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="ecom-card-img"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                  <div className="ecom-img-overlay" />
                </div>

                {/* Body */}
                <div className="ecom-card-body">
                  {product.category && (
                    <span className="ecom-category">{product.category}</span>
                  )}
                  <h3 className="ecom-name">{product.name}</h3>
                  {product.publisher && (
                    <p className="ecom-publisher">by {product.publisher}</p>
                  )}
                  <button className="ecom-shop-btn">View Product →</button>
                </div>
              </div>
            ))
            : !loading && (
              <div className="ecom-empty">
                <StorefrontIcon style={{ fontSize: 48, opacity: 0.3 }} />
                <p>No products available right now.</p>
              </div>
            )}
      </div>
    </div>
  );
};

export default Products;
