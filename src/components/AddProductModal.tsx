import React, { useState } from 'react';
import './AddProductModal.css';
import type { Product, ProductCategory } from '../types/types';

interface ProductFormState {
  title: string;
  image: string;
  price: string;
  stock: string;
  category: ProductCategory;
  description: string;
  brand: string;
  isPromo: boolean;
}

interface AddProductModalProps {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Console',
  'Jeu',
  'Carte Prépayée',
  'Accessoire',
  'Goodies'
];


interface AddProductModalProps {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AddProductModal = ({ setProducts }: AddProductModalProps) => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductFormState>({
    title: '',
    image: '',
    price: '',
    stock: '',
    category: 'Jeu',
    description: '',
    brand: '',
    isPromo: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProduct({
      title: '',
      image: '',
      price: '',
      stock: '',
      category: 'Jeu',
      description: '',
      brand: '',
      isPromo: false,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleConfirm = async () => {
    if (product.price === '' || product.stock === '' || isNaN(Number(product.price))) {
      alert('Please enter valid numbers for price and stock');
      return;
    }

    setIsSubmitting(true);
    const productToAdd = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
    };

    try {
      const response = await fetch('http://localhost:3001/product/creat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToAdd),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      alert('Product added successfully ✅');
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button className="add-button" onClick={handleOpen}>+ Product</button>

      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleClose}>×</button>
            <h2>Ajouter un produit</h2>

            <label htmlFor="title">Titre du produit</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Ex: FIFA 24"
              value={product.title}
              onChange={handleChange}
              required
            />

            <label htmlFor="image">Image (URL)</label>
            <input
              type="text"
              id="image"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={product.image}
              onChange={handleChange}
              required
              
            />

            <label htmlFor="price">Prix (DA)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Ex: 49.99"
              value={product.price}
              onChange={handleChange}
              required
              min={0}
            />

            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              placeholder="Quantité disponible"
              value={product.stock}
              onChange={handleChange}
              required
              min={0}
            />

            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description du produit"
              value={product.description}
              onChange={handleChange}
              rows={4}
            />

            <label htmlFor="brand">Marque</label>
            <input
              type="text"
              id="brand"
              name="brand"
              placeholder="Sony, Nintendo, etc."
              value={product.brand}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button 
                className="confirm-btn" 
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirmer'}
              </button>
              <button className="cancel-btn" onClick={handleClose}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductModal;