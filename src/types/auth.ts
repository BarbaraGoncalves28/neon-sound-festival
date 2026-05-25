export type UserRole = "admin" | "participant";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUpdatePayload {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AuthActionResult {
  success: boolean;
  message: string;
  user?: User;
}
