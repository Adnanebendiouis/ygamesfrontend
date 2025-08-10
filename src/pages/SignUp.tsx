import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithCSRF } from '../utils/csrf';
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { API_BASE_URL } from '../constants/baseUrl';
import '../styles/SignUp.css'; // Assuming you have a CSS file for styling
import logo from '../images/ygames-logo.png';

const Register = () => {
    const [first_name, setFirstName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetchWithCSRF(`${API_BASE_URL}/api/register/`, {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    first_name,
                    last_name: first_name, // Assuming last_name is the same as first_name for simplicity
                    confirm_password: confirmPassword,
                }),
            });

            if (response.ok) {
                const loginResponse = await fetchWithCSRF(`${API_BASE_URL}/api/login/`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ username, password }),
                });

                if (loginResponse.ok) {
                    const userData = await loginResponse.json();
                    setUser(userData);
                    console.log('Inscription + connexion réussie');
                    navigate('/');
                } else {
                    console.error('Inscription réussie mais login automatique échoué');
                    navigate('/login'); // fallback
                }
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="main1">
            <div className='wrapper1'>
                <form onSubmit={handleRegister}>
                    <Link to="/"><img className="logo-img1" src={logo} alt="Logo" /></Link>
                    <div className='c0'>
                        <div className='c3' onClick={() => navigate('/login')}><p>Se connecter</p></div>
                        <div className='c1' onClick={() => navigate('/register')}><p>S'inscrire</p></div>
                    </div>
                    <div ><p className='sentence'>Content de te revoir, Gamer !</p></div>
                    <div className='input-box1'>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='input-box1'>
                        <input
                            type="text"
                            placeholder="Name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className='input-box1'>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input-box1'>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='input-box1'>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="accept">
                        <label>
                            <input type="checkbox"  required />J’accepte les conditions générales
                        </label>
                    </div>
                    <button className="btn1" type="submit">Register</button>
                    <div className="login-link">
                        <p>Vous avez déjà un compte ? <Link to="/login"><span>Se connecter</span></Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
