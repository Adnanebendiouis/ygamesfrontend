import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSimilarProducts } from '../api/products';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Product } from "../types/types";
import '../styles/CartPage.css';
import { API_BASE_URL } from '../constants/baseUrl';
import RecProductsCard from '../components/RecProductsCard';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [, setSimilarProducts] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<Product[]>([]);
  const [, setError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const res = await fetch(`${API_BASE_URL}/api/filter/?category=PlayStation`);
        const dataC = await res.json();
        
        
        setCategory(dataC); // Assuming category is part of the response
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, [category]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
    if (storedCart.length > 0) {
      const category = storedCart[0].category;
      getSimilarProducts(category).then(setSimilarProducts);
    }
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.min(item.stock, Math.max(1, item.quantity + delta));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="cart-wrapper1">
      <div className="top-space" />

      <div className="cart-container1">
        <div className="cart-content">
          <div className="cart-left">
            {/* SECTION FIXE EN HAUT */}
            <div className="cart-left-header">
              <div className="cart-header">
                <span className="red-check"></span>
                <h3>Tous les articles ({cartItems.length})</h3>
              </div>


            </div>
            <div className="cart-header1">
              <span className="red-check"></span>
              <h3>YGAMES</h3>
            </div>
            {/* SECTION SCROLLABLE SEULEMENT */}
            <div className="cart-items-scrollable">
              <div className="cart-items">
                {cartItems.map(item => (
                  <div className="cart-item" key={item.id}>
                    <span className="red-check"></span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-product.jpg';
                      }}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">{item.price}DA</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-header2">

            </div>
          </div>

          <div className="cart-right">
            <h2>Résumé :</h2>

            <h4 style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ flex: 1, textAlign: 'left' }}>Total à payer :</span>
              <span style={{ flex: 1, textAlign: 'right' }} className="total">{getTotalPrice()} DA</span>
            </h4>

            <button
              className="checkout-btn"
              onClick={() => {
                if (cartItems.length > 0) {
                  navigate('/checkout');
                } else {
                  alert('Votre panier est vide.');
                }
              }}
            >
              Passer la commande ({cartItems.length})
            </button>
          </div>
        </div>
      </div>
      <RecProductsCard products={category} />
    </div>
  );
};

export default CartPage;
