import React from 'react';
import '../styles/Categories.css';
import psImg from '../images/ps.jpg';
import xboxImg from '../images/xbox.png';
import nintendoImg from '../images/nintendo.jpg';
import giftCardImg from '../images/gift-card.jpg';
import jeuImg from '../images/jeu.webp';
import accessoriesImg from '../images/accessories.jpg';
import godiesImg from '../images/godies.jpg';

interface CategoryItem {
  id: number;
  name: string;
  image: string;
  link :string ;
}

const Categories: React.FC = () => {
  const categories: CategoryItem[] = [
    { id: 1, name: 'Playstation', image: psImg, link: "" },
    { id: 2, name: 'Xbox', image: xboxImg, link: "" },
    { id: 3, name: 'Nintendo', image: nintendoImg, link: "" },
    { id: 4, name: 'Carte Prépayée', image: giftCardImg, link: "" },
    { id: 5, name: 'Jeux Video', image: jeuImg, link: "" },
    { id: 6, name: 'Accessoires', image: accessoriesImg, link: "" },
    { id: 7, name: 'Godies', image: godiesImg, link: "" }
  ];