import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AuthField } from '../../components/auth/AuthField'
import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { useAuth } from '../../hooks/useAuth'
import { usePasswordCriteria } from '../../hooks/usePasswordCriteria'

const emailPattern = /\S+@\S+\.\S+/

export default function RegisterPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const passwordCriteria = usePasswordCriteria(password)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  function validate() {
    const nextErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: '',
    }
    let valid = true

    if (!name.trim()) {
      nextErrors.name = 'Digite seu nome completo.'
      valid = false
    }

    if (!email.trim()) {
      nextErrors.email = 'Informe um e-mail válido.'
      valid = false
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Formato de e-mail inválido.'
      valid = false
    }

    if (!password) {
      nextErrors.password = 'Crie uma senha segura.'
      valid = false
    } else if (!passwordCriteria.valid) {
      nextErrors.password =
        'A senha precisa ser forte e corresponder aos critérios abaixo.'
      valid = false
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'As senhas precisam ser iguais.'
      valid = false
    }

    if (!acceptTerms) {
      nextErrors.acceptTerms = 'Você precisa aceitar os termos do festival.'
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

      await new Promise((resolve) => setTimeout(resolve, 900))

      const result = register(name, email, password)

      if (result.success) {
        toast.success('Conta criada com sucesso!')
        navigate('/')
      } else {
        toast.error(result.message)

        setErrors((prev) => ({
          ...prev,
          email: result.message,
        }))
      }
    } catch (error) {
      console.error(error)

      toast.error('Erro ao criar conta.')

      setErrors((prev) => ({
        ...prev,
        email: 'Erro ao criar conta.',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageShell
      title="Crie sua conta Neon Sound"
      description="Registre-se como participant ou admin para acessar line-up, ingressos e dashboards de festival premium."
      cta="Já possui conta? Entre agora"
      ctaUrl="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <AuthField
          icon={User}
          label="Nome completo"
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome como no ingresso"
          autoComplete="name"
          error={errors.name}
        />

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
          placeholder="8+ caracteres, símbolo, maiúscula"
          autoComplete="new-password"
          error={errors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((state) => !state)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              className="cursor-pointer text-white/60 transition hover:text-white"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />

        <div className="grid gap-2 rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
          <p className="font-semibold text-white">Sua senha deve conter</p>
          <ul className="space-y-2">
            <li
              className={
                passwordCriteria.length ? 'text-cyan-300' : 'text-white/40'
              }
            >
              • 8 ou mais caracteres
            </li>
            <li
              className={
                passwordCriteria.uppercase ? 'text-cyan-300' : 'text-white/40'
              }
            >
              • Uma letra maiúscula
            </li>
            <li
              className={
                passwordCriteria.number ? 'text-cyan-300' : 'text-white/40'
              }
            >
              • Um número
            </li>
            <li
              className={
                passwordCriteria.symbol ? 'text-cyan-300' : 'text-white/40'
              }
            >
              • Um símbolo especial
            </li>
          </ul>
        </div>

        <AuthField
          icon={Lock}
          label="Confirmar senha"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repita a senha"
          autoComplete="new-password"
          error={errors.confirmPassword}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((state) => !state)}
              aria-label={
                showConfirmPassword
                  ? 'Ocultar confirmação de senha'
                  : 'Exibir confirmação de senha'
              }
              className="cursor-pointer text-white/60 transition hover:text-white"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />

        <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/40 p-4">
          <label className="inline-flex items-center gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => setAcceptTerms(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black text-purple-500 accent-purple-400"
            />
            Aceito os{' '}
            <span className="text-purple-300">termos do festival</span> e a
            experiência Neon Sound.
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-pink-400">{errors.acceptTerms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,rgba(192,38,211,1),rgba(168,85,247,1),rgba(6,182,212,1))] px-6 py-3 text-base font-semibold text-black transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </AuthPageShell>
  ) 
}
