import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../constants/baseUrl";
import "../styles/products.css";
import { getCookie } from "../utils/csrf";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  etat: string;
  note: number;
  date_ajout: string;
  image?: string;
  categorie?: any;
}

interface CategoryPath {
  path: string;
  name?: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryPath[]>([]);
  const [error, setError] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const etatRef = useRef<HTMLSelectElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const PRODUCT_API = `${API_BASE_URL}/api/products/`;
  const CATEGORY_PATH_API = `${API_BASE_URL}/api/path/`;

  const loadProducts = async () => {
    try {
      const res = await fetch(PRODUCT_API, { credentials: "include" });
      const data = await res.json();
      const result = Array.isArray(data) ? data : data.results || [];
      setProducts(result);
      setFilteredProducts(result);
      setSuggestions(result.map((p: Product) => p.name));
    } catch (err) {
      console.error("Error loading products:", err);
      setError(true);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(CATEGORY_PATH_API);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  const populateForm =  (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
    setTimeout(async () => {
      if (nameRef.current) nameRef.current.value = product.name;
      if (priceRef.current) priceRef.current.value = String(product.price);
      if (stockRef.current) stockRef.current.value = String(product.stock);
      if (descRef.current) descRef.current.value = product.description;
      if (etatRef.current) etatRef.current.value = product.etat;
      if (noteRef.current) noteRef.current.value = String(product.note);
      if (imageRef.current) imageRef.current.value = product.image || "";
      if (categoryRef.current) categoryRef.current.value = product.categorie?.path;
    }, 50);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(PRODUCT_API + id + "/", {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    if (res.ok) {
      loadProducts();
    } else {
      alert("Failed to delete product");
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", nameRef.current?.value || "");
    formData.append("price", priceRef.current?.value || "");
    formData.append("stock", stockRef.current?.value || "");
    formData.append("description", descRef.current?.value || "");
    formData.append("etat", etatRef.current?.value || "");
    formData.append("note", noteRef.current?.value || "");
    formData.append("categorie", categoryRef.current?.value || "");
    const file = imageRef.current?.files?.[0];
    if (file) formData.append("image", file);

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? PRODUCT_API + editingProduct.id + "/" : PRODUCT_API;

    const res = await fetch(url, {
      method,
      body: formData,
      credentials: "include",
      headers: {
        "X-CSRFToken": getCookie("csrftoken") || "",
      },
    });

    if (res.ok) {
      resetForm();
      loadProducts();
    } else {
      const err = await res.json();
      alert("Failed to save: " + JSON.stringify(err));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    setFilteredProducts(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  return (
    <div className="product-list-container">
      <h2>Liste des Produits</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
        type="text"
        list="product-suggestions"
        placeholder="Rechercher un produit..."
        className="modal-input"
        value={searchTerm}
        onChange={handleSearch}
        style={{ maxWidth: "300px" }}
          />
          <button onClick={resetSearch} className="btn-cancel1">Réinitialiser</button>
        </div>
        <button className="product-add-button" onClick={() => setShowModal(true)}>
          Ajouter un produit
        </button>
      </div>
      <datalist id="product-suggestions">
        {suggestions.map((name, i) => (
          <option key={i} value={name} />
        ))}
      </datalist>


      {error ? (
        <div>Erreur lors du chargement des produits.</div>
      ) : (
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>État</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={8}>Aucun produit trouvé.</td></tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image ? (
                        <img src={p.image} width="60" height="40" alt="Product" className="table-img" />
                      ) : (
                        "Pas d'image"
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.description.slice(0, 50)}...</td>
                    <td>{p.price} DA</td>
                    <td>{p.stock}</td>
                    <td>{p.etat}</td>
                    <td>{p.note}</td>
                    <td>
                      <button className="btn-save" onClick={() => populateForm(p)}>
                        Modifier
                      </button>
                      <button className="btn-cancel" onClick={() => handleDelete(p.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</h3>
            <form onSubmit={handleAddOrUpdate}>
              <input ref={nameRef} type="text" className="modal-input" placeholder="Nom" required />
              <input ref={priceRef} type="number" className="modal-input" placeholder="Prix" required />
              <input ref={stockRef} type="number" className="modal-input" placeholder="Stock" required />
              <textarea ref={descRef} className="modal-input" placeholder="Description" required></textarea>
              <select ref={etatRef} className="modal-input" required>
                <option value="">État</option>
                <option value="neuf">Neuf</option>
                <option value="occasion">Occasion</option>
              </select>
              <input ref={noteRef} type="number" className="modal-input" placeholder="Note" step="0.1" max="10" required />
              <input ref={imageRef} type="file" className="modal-input" accept="image/*" />
              <select ref={categoryRef} className="modal-input" required>
                <option value="">Sélectionner une catégorie...</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.path}>{cat.path || cat.name}</option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={resetForm}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
