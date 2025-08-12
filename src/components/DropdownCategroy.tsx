import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CategoryDropdown.css";

interface Category {
  label: string;
  sub?: string[];
}

const categories: Category[] = [
  {
    label: "PlayStation",
    sub: [
      "Consoles PlayStation",
      "PlayStation 5",
      "PlayStation 4",
      "jeux PlayStation",
      "jeux PlayStation 5",
      "jeux PlayStation 4",
      "jeux PlayStation 3",
      "Accessoire PlayStation",
      "Accessoire PlayStation 5",
      "Accessoire PlayStation 4",
      "Manettes PlayStation",
      "Manettes PlayStation 5",
      "Manettes PlayStation 4",
      "Casque PlayStation",
      "Casque PlayStation 5",
    ],
  },
  {
    label: "Nintendo Switch",
    sub: [
      "Jeux Nintendo Switch",
      "Jeux Nintendo Switch 1",
      "Jeux Nintendo Switch 2",
      "Consoles Nintendo Switch",
      "Nintendo Switch 1",
      "Nintendo Switch 2",
      "Accessoire Nintendo Switch",
      "Accessorie Nintendo Switch 1",
      "Accessorie Nintendo Switch 2",
      "Casque Nintendo Switch",
    ],
  },
  {
    label: "Xbox",
    sub: [
      "Consoles Xbox",
      "Xbox Series X",
      "Xbox Series S",
      "Xbox One",
      "jeux Xbox",
      "jeux Xbox Series X",
      "jeux Xbox One",
      "jeux Xbox 360",
      "Accessoire Xbox",
      "Accessoire Xbox Series X&S",
      "Accessoire Xbox One",
      "Manettes Xbox",
      "Manettes Xbox One",
      "Manettes Xbox Series X&S",
      "Casque Xbox",
    ],
  },
  {
    label: "Digital",
    sub: [
      "Abonnements",
      "Xbox Game Pass",
      "PlayStation Plus",
      "Carte PSN",
      "Streaming",
      "Netflix",
      "Spotify",
    ],
  },
  {
    label: "Accessoire",
    sub: ["Figurine", "Goodies & Cartes à jouer"],
  },
];

const CategoryDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClick = (category: string) => {
    navigate(`/Category/${category}`);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <button
        className="dropbtn"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        Category
      </button>

      {open && (
        <div
          className="dropdown-content"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {categories.map((main) => (
            <div className="dropdown-submenu" key={main.label}>
              <div className="submenu-title">{main.label}</div>
              <div className="submenu-items">
                {main.sub?.map((subItem) => (
                  <div
                    key={subItem}
                    className="dropdown-item"
                    onClick={() => handleClick(subItem)}
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
