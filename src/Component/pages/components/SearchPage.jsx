import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function SearchPage() {
  const [products, setProducts] = useState([]);
  const { search } = useLocation(); // get ?keyword=shirt from URL
  const keyword = new URLSearchParams(search).get("keyword");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword) return;
      try {
        const { data } = await axios.get(`https://navdana.com/api/v1/product/search?keyword=${keyword}`);
        setProducts(data.products);
      } catch (error) {
        console.error("Search failed:", error);
      }
    };
    fetchProducts();
  }, [keyword]);

  return (
    <div className="search-results-page">
      <h2>Search results for: {keyword}</h2>
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <img src={p.images?.[0]?.url} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <span>₹{p.price}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}

export default SearchPage;
