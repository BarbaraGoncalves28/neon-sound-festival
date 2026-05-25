import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  name: string;
  email: string;
  password: string;
  role: "admin" | "participant";
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (name: string, email: string, avatarUrl?: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
  const parsedUser = JSON.parse(storedUser);

  setUser({
    ...parsedUser,
    role: parsedUser.role ?? "participant"
  });
}
  }, []);

  function login(name: string, email: string, password: string) {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find((u: User) => u.email === email);

    // se usuário já existe → validar senha
    if (foundUser) {
  if (foundUser.password !== password) {
    toast.error("Senha incorreta");
    return false;
  }

  // 🔥 ATUALIZA O NOME AQUI
  const updatedUser = {
    ...foundUser,
    name: name || foundUser.name,
    avatarUrl: null 
  };

  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));

  // atualiza também na lista de users
  const updatedUsers = users.map((u) =>
    u.email === email ? updatedUser : u
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));

  return true;
}

    // se usuário não existe → criar conta
    const role =
       email === "admin@gmail.com"
         ? "admin"
         : "participant";
         
    const newUser: User = {
      name,
      email,
      password,
      role,
      avatarUrl: null
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(newUser));

    setUser(newUser);

    return true;
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("tickets");
    setUser(null);
  }

  function updateUser(name: string, email: string, avatarUrl?: string | null) {
    if(!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      avatarUrl: avatarUrl ?? user.avatarUrl  
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}