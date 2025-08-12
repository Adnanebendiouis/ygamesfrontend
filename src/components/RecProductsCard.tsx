// src/components/ProductsCard.tsx
import '../styles/ProductsCard.css';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/baseUrl';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  etat: string;
  category: string;
}

interface Props {
  products: Product[];
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  category?: string; // Optional, if needed
}

const RecProductsCard = ({ products }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedWidth = Math.min(280, Math.max(250, containerWidth / 4));
        setCardWidth(calculatedWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToCard = (index: number) => {
    if (containerRef.current) {
      const scrollAmount = cardWidth * index;
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    const newIndex = Math.min(currentIndex + 1, products.length - 1);
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  const handlePrev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

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
        stock: product.stock,
        category: product.category 
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 2000);
  };

  const buyNow = (product: Product) => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">Recomnded products</h2>
        <div className="navigation-buttons">
          <button className="nav-button" onClick={handlePrev}>
            <ChevronLeft />
          </button>
          <button className="nav-button" onClick={handleNext}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="categories-scroll-container" ref={containerRef}>
        {products
          .filter(product => product.stock > 0)
          .map((product, index) => (
            <div
              key={index}
              className="Product-card"
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
          <div className="product-status in-stock">
            Disponible - <span>{product.etat}</span>
          </div>
          <div className="product-price">{product.price} DA</div>

          <div className="product-buttons">
            <button
              className={`btn-outline ${lastAddedId === product.id ? 'added' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
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
            >
              Acheter
            </button>
          </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecProductsCard;
