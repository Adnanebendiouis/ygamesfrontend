import React, { useState, useContext } from "react"; // Ensure React is imported for JSX
import { Link, useNavigate } from "react-router-dom";
import { fetchWithCSRF } from "../utils/csrf";
import { AuthContext } from "../context/auth-context";
import { API_BASE_URL } from "../constants/baseUrl";
import "../styles/Login.css"; // Assuming you have a CSS file for styling
import logo from "../images/ygames-logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { setUser, setIsAdmin } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");

        const token = data.token;
        const userData = data.user;
        localStorage.setItem("authToken", token);
        setUser(userData);
        setIsAdmin(userData.isAdmin || false);

        // mettre à jour l'utilisateur dans le contexte
        const adminStatus = username.trim().toLowerCase() === "admin" || username.trim().toLowerCase() === "younes";
        setUser({
          username: data.username,
          id: data.id,
        });
        setIsAdmin(adminStatus);
        console.log("User set in context:", username);

        const previousPage = sessionStorage.getItem("previousPage") || "/";
        navigate(previousPage);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="main">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <Link to="/">
            <img className="logo-img1" src={logo} alt="Logo" />
          </Link>
          <div className="c0">
            <div className="c1" onClick={() => navigate("/login")}>
              <p>Se connecter</p>
            </div>
            <div className="c2" onClick={() => navigate("/register")}>
              <p>S'inscrire</p>
            </div>
          </div>
          <div>
            <p className="sentence">Content de te revoir, Gamer !</p>
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn" type="submit">
            Se connecter
          </button>
          <div className="remember-forget">
            <Link
              to="/forgot-password"
              style={{ fontWeight: "500", fontSize: "14px" }}
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="register-link">
            <p>
              Nouveau sur YGAMES ?{" "}
              <Link to="/register">
                <span>Créez un compte</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
