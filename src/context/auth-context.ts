import { createContext } from "react";
import type { User } from "../types/types.ts"; // Vérifie que ce chemin est correct

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  logout: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});
