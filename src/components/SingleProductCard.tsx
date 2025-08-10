import React, { useState } from "react";
import type { CartItem, Product } from "../types/types";
import '../styles/ProductsCard.css';
import { API_BASE_URL } from "../constants/baseUrl";
import { useNavigate } from 'react-router-dom';
import { Check } from "@mui/icons-material";
interface Props {
  product: Product;
}

const SingleProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const addToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Quantité maximale atteinte pour ce produit.");
        return;
      } else {
        existingItem.quantity += 1;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
        stock: product.stock
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 2000);
  };

  const buyNow = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };


  return (
    <div >
      <div
        key={product.id}
        className="Product-card1"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="Product-image-container">
          <img
            src={`${API_BASE_URL}${product.image}`}
            alt={product.name}
            className="Product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/default-product.jpg';
            }}
          />
        </div>

        <div className="product-info">
          <div className="product-name">{product.name}</div>
          {product.stock <= 0 ? (
            <div className="product-status out-of-stock">Rupture de stock - <span>{product.etat}</span></div>
          ) : (
            <div className="product-status in-stock">Disponible - <span>{product.etat}</span></div>
          )}
          <div className="product-price">{product.price} DA</div>

          <div className="product-buttons">
            <button
              className={`btn-outline ${lastAddedId === product.id ? 'added' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={product.stock <= 0}
            >
              {lastAddedId === product.id ? (
                <>
                  <Check className="icon" /> Ajouté
                </>
              ) : (
                <>Ajouter au panier</>
              )}
            </button>
            <button
              className="btn-filled"
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product);
              }}
              disabled={product.stock <= 0}
            >
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;

