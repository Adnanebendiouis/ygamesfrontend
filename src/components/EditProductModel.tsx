import React, { useState } from 'react';
import './AddProductModal.css'; // Reusing same styles
import type{ Product, ProductCategory } from '../types//types';

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Console',
  'Jeu',
  'Carte Prépayée',
  'Accessoire',
  'Goodies'
];

interface EditProductModalProps {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onClose: () => void;
}

const EditProductModal = ({ product, setProducts, onClose }: EditProductModalProps) => {
  const [editedProduct, setEditedProduct] = useState({
    title: product.name,
    image: product.image,
    price: product.price.toString(),
    stock: product.stock.toString(),
    category: product.category as ProductCategory,
    description: product.description || '',
    brand: product.brand || '',
    isPromo: product.isPromo || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    }));
  };

  const handleSubmit = async () => {
    if (!editedProduct.price || !editedProduct.stock) {
      alert('Please enter valid numbers for price and stock');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/product/update/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedProduct,
          price: Number(editedProduct.price),
          stock: Number(editedProduct.stock),
        }),
      });

      if (!response.ok) throw new Error('Update failed');

      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Update failed ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Edit Product</h2>

        <label htmlFor="title">Product Title</label>
        <input
          type="text"
          name="title"
          value={editedProduct.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="image">Image URL</label>
        <input
          type="text"
          name="image"
          value={editedProduct.image}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price (DA)</label>
        <input
          type="number"
          name="price"
          value={editedProduct.price}
          onChange={handleChange}
          required
          min={0}
        />

        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          name="stock"
          value={editedProduct.stock}
          onChange={handleChange}
          required
          min={0}
        />

        <label htmlFor="category">Category</label>
        <select
          name="category"
          value={editedProduct.category}
          onChange={handleChange}
          required
        >
          {PRODUCT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={editedProduct.description}
          onChange={handleChange}
          rows={4}
        />

        <label htmlFor="brand">Brand</label>
        <input
          type="text"
          name="brand"
          value={editedProduct.brand}
          onChange={handleChange}
        />

        <div className="promo-checkbox">
          <label htmlFor="isPromo">Promotion pourcentage %</label>
          <input
            type="number"
            id="isPromo"
            name="isPromo"
            value={Number(editedProduct.isPromo)}
            onChange={handleChange}
            
            max={100}
          />
        </div>

        <div className="modal-actions">
          <button 
            className="confirm-btn" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;