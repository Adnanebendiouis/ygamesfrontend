import React, { useState } from 'react';
import type { User } from '../types/types.ts';
import { AuthContext } from './auth-context';
import { fetchWithCSRF } from '../utils/csrf.ts';
import { API_BASE_URL } from '../constants/baseUrl.ts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!user;
    const IsAdmin = user?.username === 'admin'; // Assuming 'admin' is the username for admin users

    const logout = async () => {
        try {
            const response = await fetchWithCSRF(`${API_BASE_URL}/api/logout/`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                console.log('Déconnecté avec succès');
            } else {
                console.error('Erreur de déconnexion:', await response.text());
            }
        } catch (error) {
            console.error('Erreur réseau pendant logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, IsAdmin, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
