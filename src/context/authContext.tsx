import { createContext } from "react";
import type { AuthActionResult, AuthUpdatePayload, User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => AuthActionResult;
  register: (name: string, email: string, password: string) => AuthActionResult;
  logout: () => void;
  updateUser: (payload: AuthUpdatePayload) => AuthActionResult;
}

export const AuthContext = createContext<AuthContextType | null>(null);
