import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { API_BASE_URL } from '../constants/baseUrl';
import SimProductsCard from '../components/SimProductsCard';

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    image: string;
    note: string;
    stock: number;
    etat: string;
    date_ajout: string;
    categorie_nom: string;
}

export interface Product1 {
  id: string;
  name: string; // Alias for name
  brand: string;
  description: string;
  price: number ;
  oldPrice?: number;
  stock: number;
  image: string;
  category: string;
  isPromo: number;
  etat: string;
  note: string;
  date_ajout: string;
  categorie_nom:  string;
}

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    stock: number;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [alreadyInCart, setAlreadyInCart] = useState(false);
    const [categoryP, setCategoryP] = useState<Product1[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/product-detail/${id}/`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
                
                const resP = await fetch(`${API_BASE_URL}/api/filter/?category=${data.categorie_nom}`);
                const dataP = await resP.json();
                
                setCategoryP(dataP);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (value: number) => {
        if (product && value > 0 && value <= product.stock) {
            setQuantity(value);
        }
    };

    const addToCart = (showFeedback: boolean = true): boolean => {
        if (!product) return false;

        const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === String(product.id));

        if (existingItem) {
            if (showFeedback) {
                setAlreadyInCart(true);
                setTimeout(() => setAlreadyInCart(false), 2000);
            }
            return false;
        }

        if (quantity > product.stock) {
            if (showFeedback) {
                alert("La quantité demandée dépasse le stock disponible.");
            }
            return false;
        }

        cart.push({
            id: String(product.id),
            name: product.name,
            image: product.image,
            price: parseFloat(product.price),
            quantity: quantity,
            stock: product.stock,
        });

        localStorage.setItem('cart', JSON.stringify(cart));

        if (showFeedback) {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }

        return true;
    };

    const buyNow = () => {
        if (!product) return;

        const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === String(product.id));

        if (existingItem) {
            navigate('/cart');
        } else {
            const success = addToCart(false);
            if (success) navigate('/cart');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="not-found">Product not found</div>;

    return (
        <div>
            <div className="product-detail-container1"></div>
            <div className="product-detail-container1">
                <div className="product-header">
                    <h1>{product.name}</h1>
                </div>

                <div className="product-content1">
                    <div className="product-image-container">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image1"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                            }}
                        />
                    </div>

                    <div className="product-info">
                        <div className="product-price">{parseFloat(product.price).toFixed(2)} DA</div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                            <p>{product?.categorie_nom}</p>
                        </div>

                        <div className="product-condition">
                            <span>Condition:</span> {product.etat}
                        </div>

                        {product.stock > 0 && (
                            <div className="product-actions">
                                <button
                                    className={`add-to-cart ${added ? 'added-button' : ''}`}
                                    onClick={() => addToCart()}
                                >
                                    {added ? '✔ Ajouté' : 'Add to Cart'}
                                </button>

                                <button className="buy-now" onClick={buyNow}>
                                    Buy Now
                                </button>

                                <div className="quantity-selector">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                {alreadyInCart && (
                                    <div className="added-message">Produit déjà dans le panier.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <SimProductsCard products={categoryP} />
        </div>
    );
};

export default ProductDetail;
