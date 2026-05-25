import { ReactNode } from "react";

interface AuthPageShellProps {
  title: string;
  description: string;
  cta: string;
  ctaUrl: string;
  children: ReactNode;
  footnote?: ReactNode;
}

export function AuthPageShell({ title, description, cta, ctaUrl, children, footnote }: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,70,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,45,255,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-[1fr_1.2fr]">
          <section className="order-2 flex flex-col justify-center gap-8 rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_0_50px_rgba(111,38,255,0.12)] backdrop-blur-xl sm:order-1 sm:p-10 lg:p-12">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-200">
                Neon Sound Festival 2027
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">{description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-purple-400/10 bg-black/50 p-5 shadow-[0_0_20px_rgba(102,126,234,0.12)]">
                <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Acesso VIP</p>
                <p className="mt-3 text-lg font-semibold text-white">Verificação de multi-palco</p>
              </div>
              <div className="rounded-3xl border border-purple-400/10 bg-black/50 p-5 shadow-[0_0_20px_rgba(255,45,214,0.12)]">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Experiência</p>
                <p className="mt-3 text-lg font-semibold text-white">Painel de vendas de ingressos e analytics</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-purple-500/10 bg-black/50 p-6 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Resumo rápido</p>
              <ul className="space-y-3 text-sm text-white/70">
                <li>• Controle de participante e admin com credenciais seguras.</li>
                <li>• Dashboard premium com lógica de palco e line-up.</li>
                <li>• Autenticação local com UX de festival moderno.</li>
              </ul>
            </div>
          </section>

          <section className="order-1 flex items-center justify-center sm:order-2">
            <div className="w-full max-w-xl rounded-4xl border border-white/10 bg-black/70 p-8 shadow-[0_0_60px_rgba(111,38,255,0.18)] backdrop-blur-2xl sm:p-10">
              <div className="mb-10 flex flex-col gap-2">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Acesso seguro</p>
                <h2 className="text-2xl font-semibold text-white">Design de autenticação premium</h2>
                <p className="text-sm leading-6 text-white/70">Conecte-se ao universo Neon Sound com segurança e fluidez.</p>
              </div>

              {children}

              <div className="mt-8 flex flex-col gap-4 text-sm text-white/70">
                <a href={ctaUrl} className="font-semibold text-cyan-200 transition hover:text-cyan-100">{cta}</a>
                {footnote}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
