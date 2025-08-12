import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../types/types";
import { API_BASE_URL } from "../constants/baseUrl";
import SingleProductCard from "../components/SingleProductCard";
import "../styles/Category.css";
import { MdArrowBack } from "react-icons/md";

const PRODUCTS_PER_PAGE = 9;

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [, setPriceMax] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceInput, setPriceInput] = useState("");

  // FETCH
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/filter/?category=${category}`);
        const data = await res.json();
        
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError(true);
      }
    };
    fetchData();
  }, [category]);

  // FILTER BUTTON
  const applyPriceFilter = () => {
    if (priceInput) {
      const max = Number(priceInput);
      const filtered = products.filter((p) => p.price <= max);
      setFilteredProducts(filtered);
      setPriceMax(max);
      setCurrentPage(1);
    }
  };

  // RESET FILTER
  const resetFilter = () => {
    setPriceInput("");
    setPriceMax(null);
    setFilteredProducts(products);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (error) {
    return <div className="error-message">Une erreur est survenue.</div>;
  }

  return (
    <div className="category-container">
      <div className="searchbar-space"></div>
      <div className="category-page">
        <aside className="filter-section">
          <span className="back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack />
          </span>
          <p style={{ textAlign: "center" }}>Filtrer par prix</p>
          <br />
          <input
            className="input-box1"
            type="number"
            placeholder="Prix max"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
          <button className="btn555" onClick={applyPriceFilter}>Filtrer</button>
          <button className="btn555" onClick={resetFilter}>Réinitialiser</button>
        </aside>

        <main className="products-section">
          <div className="header-bar">
            <div className="breadcrumb">
              <p>Accueil &gt; Catégorie &gt; {category}</p>
            </div>
          </div>

          <div className="products-grid">
            {displayedProducts.map((product) => (
              <SingleProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={i + 1 === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Category;
