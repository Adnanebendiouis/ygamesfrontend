import React, { useState, useEffect } from 'react';
import type { User } from '../types/types.ts';
import { AuthContext } from './auth-context';
import { fetchWithCSRF } from '../utils/csrf.ts';
import { API_BASE_URL } from '../constants/baseUrl.ts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const isAuthenticated = !!user;

    // On component mount, check localStorage for auth token
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Optionally, you can validate the token or fetch user info from your backend here
            // For example, fetch user info with the token or decode the token

            // Example: fake user fetch (replace with real fetch if needed)
            fetch(`${API_BASE_URL}/api/user/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch user');
                    return res.json();
                })
                .then((data: User) => {
                    setUser(data);
                    // You can also set isAdmin based on user data here:
                    setIsAdmin(data.isAdmin || false);
                })
                .catch(() => {
                    // Token invalid or expired — remove it
                    localStorage.removeItem('authToken');
                    setUser(null);
                    setIsAdmin(false);
                });
        }
    }, []);

    const logout = async () => {
        try {
            const response = await fetchWithCSRF(`${API_BASE_URL}/api/logout/`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                setIsAdmin(false);
                localStorage.removeItem('authToken'); // clear token on logout
                console.log('Déconnecté avec succès');
            } else {
                console.error('Erreur de déconnexion:', await response.text());
            }
        } catch (error) {
            console.error('Erreur réseau pendant logout:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                logout,
                isAdmin,
                setIsAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
