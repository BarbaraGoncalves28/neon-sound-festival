import { useEffect, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

const location = useLocation()

useEffect(() => {
  setName("")
  setEmail("")
  setPassword("")
  setConfirmPassword("")
  setErrors({
    name: "",
    email: "",
    password: ""
  })
}, [location.pathname])

  useEffect(() => {
  if (user) {
    navigate("/");
  }
}, [user, navigate]);

  const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  return regex.test(password);
};

  function validate() {
    let valid = true;

    const newErrors = {
      name: "",
      email: "",
      password: ""
    };

    if (!name.trim()) {
      newErrors.name = "Digite seu nome";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Digite seu email";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }

    if (!password) {
  newErrors.password = "Digite sua senha";
  valid = false;
} else if (!validatePassword(password)) {
  newErrors.password =
    "Senha fraca. Use 8+ caracteres, maiúscula, número e símbolo.";
  valid = false;
}

if (password !== confirmPassword) {
  newErrors.password = "As senhas não coincidem";
  valid = false;
}

    setErrors(newErrors);

    return valid;
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
  const success = login(name, email, password);

  if (success) {
    navigate("/");
  }

  setLoading(false);
}, 800);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin} autoComplete="off"
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-lg border border-purple-500 flex flex-col gap-5"
      >

        <h2 className="text-2xl md:text-3xl font-bold text-center neon-text mb-5">Seu acesso ao Festival começa aqui</h2>

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center bg-zinc-800 rounded-lg px-3">
            <User size={18} className="text-purple-400" />

            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent
  w-full
  p-3
  outline-none
  text-white
  placeholder-gray-400
  autofill:bg-transparent
  [appearance:none]"
            />
          </div>

          {errors.name && (
            <span className="text-red-400 text-sm">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center bg-zinc-800 rounded-lg px-3">
            <Mail size={18} className="text-purple-400" />

            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-email"
              className="bg-transparent
  w-full
  p-3
  outline-none
  text-white
  placeholder-gray-400
  autofill:bg-transparent
  [appearance:none]"
            />
          </div>

          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Senha */}
<div className="flex flex-col gap-1">
  <div className="flex items-center bg-zinc-800 rounded-lg px-3">
    <Lock size={18} className="text-purple-400" />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Senha"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      autoComplete="new-password"
      className="bg-transparent
  w-full
  p-3
  outline-none
  text-white
  placeholder-gray-400
  autofill:bg-transparent
  [appearance:none]"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-gray-400 hover:text-white"
    >
      {showPassword ? <Eye size={18} className="text-purple-400"/> : <EyeOff size={18} className="text-purple-400"/>}
    </button>
  </div>
</div>

{/*  */}

<div className="flex flex-col gap-1">

  <div className="flex items-center bg-zinc-800 rounded-lg px-3">
    <Lock size={18} className="text-purple-400" />

    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirmar senha"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="bg-transparent
  w-full
  p-3
  outline-none
  text-white
  placeholder-gray-400
  autofill:bg-transparent
  [appearance:none]"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="text-gray-400 hover:text-white"
    >
      {showConfirmPassword ? <Eye size={18} className="text-purple-400"/> : <EyeOff size={18} className="text-purple-400"/>}
    </button>
  </div>

  {errors.password && (
    <span className="text-red-500 text-sm mt-3">
      {errors.password}
    </span>
  )}

</div>

        {/* Botão */}
        <button
  type="submit"
  disabled={loading}
  className="bg-purple-600 hover:bg-purple-700 py-3 font-semibold mt-3 px-6 rounded-full border border-purple-500
  shadow-[0_0_8px_rgba(168,85,247,0.7)]
  hover:shadow-[0_0_16px_rgba(168,85,247,0.9)]
  transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 neon-text"
>
  {loading ? (
  <>
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin neon-text"></div>
    Entrando...
  </>
) : (
  "Entrar"
)}
</button>
      </form>
    </div>
  );
}