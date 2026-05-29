import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthField } from '../../components/auth/AuthField'
import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { useAuth } from '../../hooks/useAuth'

const emailPattern = /\S+@\S+\.\S+/

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setErrors({ email: '', password: '' })
  }, [location.pathname])

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true })
    }
  }, [navigate, redirectTo, user])

  function validate() {
    const nextErrors = { email: '', password: '' }
    let valid = true

    if (!email.trim()) {
      nextErrors.email = 'Por favor, informe o seu e-mail.'
      valid = false
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'O e-mail precisa ter um formato válido.'
      valid = false
    }

    if (!password) {
      nextErrors.password = 'Informe sua senha para continuar.'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 700))

      const result = login(email, password)
      setIsLoading(false)

      if (result.success) {
        toast.success('Login realizado com sucesso!')
        navigate('/')
      } else {
        toast.error(result.message)
        setErrors((prev) => ({ ...prev, password: result.message }))
      }
    } catch (error) {
      console.error(error)

      toast.error('Erro ao entrar na conta.')

      setErrors((prev) => ({
        ...prev,
        password: 'Erro ao entrar na conta.',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageShell
      title="Bem-vindo ao Neon Sound Festival"
      description="Acesse sua conta de participante ou admin e gerencie vendas, ingressos e experiência do festival em uma plataforma premium."
      cta="Ainda não tem conta? Crie agora"
      ctaUrl="/register"
      footnote={
        <p>
          Deseja recuperar o acesso?{' '}
          <Link
            to="/forgot-password"
            className="text-purple-300 hover:text-purple-100"
          >
            Esqueci minha senha
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <AuthField
          icon={Mail}
          label="E-mail"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@dominio.com"
          autoComplete="email"
          error={errors.email}
        />

        <AuthField
          icon={Lock}
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••••"
          autoComplete="current-password"
          error={errors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              className="text-white/60 transition hover:text-white"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 px-6 py-3 text-base font-semibold text-black transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthPageShell>
  )
}
