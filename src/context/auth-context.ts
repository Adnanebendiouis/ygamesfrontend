import { createContext } from "react";
import type { User } from "../types/types.ts";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  IsAdmin: boolean; // 👈 added here
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  IsAdmin: false, // 👈 default value
  logout: () => {},
});
