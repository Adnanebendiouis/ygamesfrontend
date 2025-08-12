import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';
import { API_BASE_URL } from '../constants/baseUrl';
import { fetchWithCSRF } from '../utils/csrf';
import { MdArrowBack } from 'react-icons/md';

const Checkout = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [adresse, setAdresse] = useState('');
  const [typeLivraison, setTypeLivraison] = useState<'livraison' | 'pick up'>('pick up');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // ✅ pour afficher un message d’erreur

  const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
  console.log('Contenu du localStorage cart:', storedCart);
  const [panier] = useState(storedCart);
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    return storedCart.reduce((total: number, item: { price: string | number; quantity: number }) => {
      return total + parseFloat(item.price as string) * item.quantity;
    }, 0);
  };

  const total = calculateTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Vérification panier vide
    if (panier.length === 0) {
      setErrorMessage("Votre panier est vide. Vous ne pouvez pas passer une commande.");
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const isDelivery = typeLivraison === 'livraison';

    const payload = {
      full_name: fullName,
      phone,
      wilaya: isDelivery ? wilaya : 'none',
      commune: isDelivery ? commune : 'none',
      adresse: isDelivery ? adresse : 'none',
      total: isDelivery ? total + 900 : total,
      status: 'en cours',
      type: typeLivraison,
      items: panier.map((item: { id: string; quantity: number }) => {
        console.log('Produit brut:', item);
        return {
          produit_id: parseInt(item.id),
          quantity: item.quantity,
        };
      }),
    };

    console.log('Payload envoyé:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/order/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur détaillée :', JSON.stringify(errorData, null, 2));
        alert('Erreur : ' + JSON.stringify(errorData));
        setLoading(false);
        return;
      }

      localStorage.removeItem('cart');
      const data = await response.json();
      console.log('Commande réussie :', data);
      alert('Commande passée avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert("Erreur réseau lors de l'envoi de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main2">
        <button className="back-button1" onClick={() => navigate('/')}>
          <MdArrowBack />
        </button>
      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Finaliser la commande</h2>

          {errorMessage && (
            <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>
          )}

          <input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            list="delivery-options"
            placeholder="Option livraison"
            onChange={(e) => {
              const selectedOption = e.target.value;
              if (selectedOption === 'livraison') {
                setTypeLivraison('livraison');
              } else if (selectedOption === 'recuperation de produit du magasin') {
                setTypeLivraison('pick up');
              }
            }}
          />
          <datalist id="delivery-options">
            <option value="livraison" />
            <option value="recuperation de produit du magasin" />
          </datalist>

          {typeLivraison === 'livraison' && (
            <>
              <input
                type="text"
                placeholder="Wilaya"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Commune"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                required
              />
            </>
          )}

          <button className="btn5" type="submit" disabled={loading}>
            {loading ? 'Commande en cours...' : 'Commander'}
          </button>
        </form>
      </div>

      <div className="checkout-resume">
        <h3>Résumé :</h3>
        <div className="delivery-price">
          <p>Prix:</p>
          <p>{total} DA</p>
        </div>
        <div className="delivery-price">
          <p>Frais de livraison:</p>
          <p>{typeLivraison === 'livraison' ? 900 : 0} DA</p>
        </div>
        <div className="total-price">
          <h3>Total à payer:</h3>
          <h3 style={{ color: '#C30A1D' }}>
            {typeLivraison === 'livraison' ? total + 900 : total} DA
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

