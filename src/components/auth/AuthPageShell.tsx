import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.jpg'

interface AuthPageShellProps {
  title: string
  description: string
  cta: string
  ctaUrl: string
  children: ReactNode
  footnote?: ReactNode
}

export function AuthPageShell({
  title,
  description,
  cta,
  ctaUrl,
  children,
  footnote,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,70,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,45,255,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid flex-1 gap-6 lg:grid-cols-2 lg:gap-0">
          <section className="order-2 flex flex-col gap-8 rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_50px_rgba(111,38,255,0.12)] backdrop-blur-xl sm:order-1 sm:p-8 lg:rounded-r-none lg:p-12 xl:p-14">
            <div className="space-y-8">
              <Link
                to="/"
                className="inline-flex w-fit items-center gap-4 rounded-full border border-white/10 bg-black/40 px-3 py-2 transition duration-300 hover:border-cyan-300/40 hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
              >
                <img
                  src={logo}
                  alt="Logotipo do Neon Sound Festival"
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
                />
                <span className="text-left text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
                  Voltar para a home
                </span>
              </Link>

              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-200">
                  Neon Sound Festival 2027
                </span>
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-purple-400/10 bg-black/50 p-5 shadow-[0_0_20px_rgba(102,126,234,0.12)]">
                <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
                  Acesso VIP
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  Verificação de multi-palco
                </p>
              </div>
              <div className="rounded-3xl border border-purple-400/10 bg-black/50 p-5 shadow-[0_0_20px_rgba(255,45,214,0.12)]">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                  Experiência
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  Painel de vendas de ingressos e analytics
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-purple-500/10 bg-black/50 p-6 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Resumo rápido
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  • Controle de participante e admin com credenciais seguras.
                </li>
                <li>• Dashboard premium com lógica de palco e line-up.</li>
                <li>• Autenticação local com UX de festival moderno.</li>
              </ul>
            </div>
          </section>

          <section className="order-1 flex items-stretch justify-center sm:order-2">
            <div className="flex w-full flex-1 flex-col justify-center rounded-4xl border border-white/10 bg-black/70 p-6 shadow-[0_0_60px_rgba(111,38,255,0.18)] backdrop-blur-2xl sm:p-8 lg:rounded-l-none lg:p-12 xl:p-14">
              <div className="mb-10 flex flex-col gap-2">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                  Acesso seguro
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Design de autenticação premium
                </h2>
                <p className="text-sm leading-6 text-white/70">
                  Conecte-se ao universo Neon Sound com segurança e fluidez.
                </p>
              </div>

              {children}

              <div className="mt-8 flex flex-col gap-4 text-sm text-white/70">
                <Link
                  to={ctaUrl}
                  className="font-semibold text-cyan-200 transition hover:text-cyan-100 focus:outline-none focus-visible:text-cyan-100"
                >
                  {cta}
                </Link>
                {footnote}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
