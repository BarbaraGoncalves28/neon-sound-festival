import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthPageShell } from "../../components/auth/AuthPageShell";
import { AuthField } from "../../components/auth/AuthField";
import { resetPasswordRequest } from "../../services/authService";

export default function ForgotPasswordPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Por favor, informe o e-mail cadastrado.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const result = resetPasswordRequest(email);
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message);
      setEmail("");
    } else {
      setError(result.message);
    }
  }

  return (
    <AuthPageShell
      title="Recupere sua senha"
      description="Solicite a recuperação de senha e mantenha seu acesso ao controle de ingressos e cadastro do Neon Sound Festival 2027."
      cta="Já tem conta? Entrar"
      ctaUrl="/login"
      footnote={
        <p>
          Se lembrar da senha, volte para <Link to="/login" className="text-purple-300 hover:text-purple-100">entrar</Link>.
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <AuthField
          icon={Mail}
          label="E-mail cadastrado"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@dominio.com"
          autoComplete="email"
          error={error}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-cyan-400 via-purple-500 to-fuchsia-500 px-6 py-3 text-base font-semibold text-black transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Enviando link..." : "Solicitar recuperação"}
        </button>

        {message ? <p className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{message}</p> : null}
        {user ? <p className="text-sm text-white/60">Você já está logado como {user.name}.</p> : null}
      </form>
    </AuthPageShell>
  );
}
