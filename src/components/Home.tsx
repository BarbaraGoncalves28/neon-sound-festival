import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  artists as defaultFestivalArtists,
  eventDate,
  festivalDays,
  headliners,
  heroImage,
  openingArtists,
  stages,
  ticketSummaries,
} from '../data/festivalData'
import { useProtectedNavigation } from '../hooks/useProtectedNavigation'
import {
  ADMIN_DATA_UPDATED_EVENT,
  getStoredArtists,
} from '../modules/admin/store/adminPersistence'

type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const initialCountdown: CountdownState = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
}

function getCountdown(): CountdownState {
  const now = Date.now()
  const distance = eventDate.getTime() - now

  if (distance <= 0) {
    return initialCountdown
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  }
}

export function Home() {
  const openProtectedRoute = useProtectedNavigation()
  const [countdown, setCountdown] = useState<CountdownState>(getCountdown)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [liveSoldCount, setLiveSoldCount] = useState(220552)
  const [additionalArtists, setAdditionalArtists] = useState(() => {
    const defaultNames = new Set(
      defaultFestivalArtists.map((artist) => artist.name.trim().toLowerCase()),
    )

    return getStoredArtists().filter(
      (artist) => !defaultNames.has(artist.name.trim().toLowerCase()),
    )
  })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveSoldCount((previous) =>
        Math.min(previous + Math.floor(Math.random() * 35 + 8), 280000),
      )
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const syncAdditionalArtists = () => {
      const defaultNames = new Set(
        defaultFestivalArtists.map((artist) =>
          artist.name.trim().toLowerCase(),
        ),
      )

      setAdditionalArtists(
        getStoredArtists().filter(
          (artist) => !defaultNames.has(artist.name.trim().toLowerCase()),
        ),
      )
    }

    window.addEventListener('storage', syncAdditionalArtists)
    window.addEventListener(ADMIN_DATA_UPDATED_EVENT, syncAdditionalArtists)

    return () => {
      window.removeEventListener('storage', syncAdditionalArtists)
      window.removeEventListener(
        ADMIN_DATA_UPDATED_EVENT,
        syncAdditionalArtists,
      )
    }
  }, [])

  const metrics = useMemo(
    () => [
      {
        label: 'Artistas confirmados',
        value: `+${defaultFestivalArtists.length + additionalArtists.length}`,
      },
      { label: 'Palcos ativos', value: `${stages.length}` },
      { label: 'Dias de festival', value: `${festivalDays.length}` },
      { label: 'Capacidade total', value: '+220k' },
    ],
    [additionalArtists],
  )

  const countdownCards = useMemo(
    () => [
      { label: 'Dias', value: countdown.days },
      { label: 'Horas', value: countdown.hours },
      { label: 'Min', value: countdown.minutes },
      { label: 'Seg', value: countdown.seconds },
    ],
    [countdown],
  )

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = newsletterEmail.trim().toLowerCase()

    if (!normalizedEmail) {
      setNewsletterError('Digite seu e-mail para receber novidades.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNewsletterError('Informe um e-mail válido.')
      return
    }

    setNewsletterError('')
    setNewsletterSubscribed(true)
    setNewsletterEmail(normalizedEmail)
  }

  return (
    <div className="bg-black text-white">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.28),transparent_38%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-200">
              Festival multi-palco • São Paulo
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Neon Sound Festival 2027 com experiência premium em qualquer tela
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Três dias de festival, quatro palcos e uma jornada pensada para
              discovery, compra de ingressos e gestão do evento com fluidez de
              produto real.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  openProtectedRoute(
                    '/ingressos',
                    'Faça login para garantir seu ingresso.',
                  )
                }
                className="neon-button rounded-full px-6 py-3 text-sm font-bold text-white sm:px-8"
              >
                Comprar ingresso
              </button>
              <Link
                to="/lineup"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-8"
              >
                Explorar line-up
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {countdownCards.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-[0_0_20px_rgba(168,85,247,0.14)] backdrop-blur-md"
              >
                <p className="text-3xl font-semibold sm:text-4xl">
                  {String(item.value).padStart(2, '0')}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-purple-200">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6"
            >
              <p className="text-3xl font-bold neon-text">{metric.value}</p>
              <p className="mt-2 text-sm text-white/65">{metric.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Headliners que movem o line-up
          </h2>
          <p className="mt-3 text-white/65">
            Curadoria visual e editorial consistente, com cards fluidos e
            hierarquia clara para navegar bem em mobile, desktop e telas largas.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {headliners.map((artist) => (
            <article
              key={artist.id}
              className="group overflow-hidden rounded-4xl border border-white/10 bg-zinc-950/80 shadow-[0_0_50px_rgba(168,85,247,0.08)]"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={artist.image}
                  alt={`${artist.name}, artista do gênero ${artist.genre}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-purple-200">
                    Dia {artist.day}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {artist.name}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-purple-300">
                  {artist.genre}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Abertura oficial com direção de experiência
            </h2>
            <p className="mt-3 text-white/65">
              O bloco de abertura agora escala melhor em telas menores e mantém
              impacto visual sem quebrar texto, imagem ou espaçamento.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {openingArtists.map((artist, index) => (
              <article
                key={artist.id}
                className="relative overflow-hidden rounded-4xl border border-white/10 bg-black/50 p-4 sm:p-6"
              >
                <span className="pointer-events-none absolute right-3 top-0 text-[6rem] font-black text-purple-500/10 sm:text-[8rem]">
                  {index + 1}
                </span>
                <div className="relative h-72 overflow-hidden rounded-3xl">
                  <img
                    src={artist.image}
                    alt={`${artist.name}, atração de abertura do festival`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />
                </div>
                <div className="relative pt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                    Primeiros beats
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{artist.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{artist.genre}</p>
                  <p className="mt-4 text-sm text-white/55">
                    Dia {artist.day} • 18:00
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {additionalArtists.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Novos artistas adicionados pela curadoria
            </h2>
            <p className="mt-3 text-white/65">
              A base oficial da home continua como referência, e os novos
              cadastros feitos no painel aparecem aqui automaticamente.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {additionalArtists.map((artist) => (
              <article
                key={artist.id}
                className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                      Novo cadastro
                    </p>
                    <h3 className="mt-3 text-2xl font-bold neon-text">
                      {artist.name}
                    </h3>
                  </div>

                  <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
                    {artist.day ? `Dia ${artist.day}` : 'Line-up aberto'}
                  </span>
                </div>

                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/65">
                  {artist.genre}
                </p>

                <p className="mt-6 text-sm text-white/55">
                  Artista criado pelo formulário de gestão e somado
                  automaticamente ao catálogo do festival.
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Experiência multi-palco sem ruído visual
          </h2>
          <p className="mt-3 text-white/65">
            Informação objetiva para orientar o público rapidamente: capacidade,
            proposta artística e organização espacial clara.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => (
            <article
              key={stage.id}
              className="rounded-3xl border border-white/10 bg-zinc-950/75 p-6"
            >
              <h3 className="text-2xl font-bold neon-text">{stage.name}</h3>
              <p className="mt-3 text-sm text-white/70">{stage.style}</p>
              <p className="mt-5 text-sm font-medium text-purple-200">
                Capacidade de {stage.capacity.toLocaleString('pt-BR')} pessoas
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Local do festival
              </h2>
              <p className="mt-3 max-w-xl text-white/65">
                Tudo que o público precisa saber para chegar, circular e
                aproveitar o evento com segurança, conforto e acessibilidade.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-xl font-semibold neon-text">Endereço</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Autódromo de Interlagos
                  <br />
                  Av. Senador Teotônio Vilela, 261
                  <br />
                  Interlagos — São Paulo/SP
                </p>
                <a
                  href="https://www.google.com/maps?q=Autódromo+de+Interlagos"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-purple-300 transition hover:text-purple-200"
                >
                  Abrir no Google Maps
                </a>
              </article>

              <article className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-xl font-semibold neon-text">
                  Logística inteligente
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-white/70">
                  <li>• Estação Autódromo com rota dedicada.</li>
                  <li>• Área oficial para apps de mobilidade.</li>
                  <li>• Acessos sinalizados por palco e setor.</li>
                  <li>• Time de suporte e posto médico 24h.</li>
                </ul>
              </article>
            </div>
          </div>

          <div className="overflow-hidden rounded-4xl border border-purple-500/25 shadow-[0_0_40px_rgba(168,85,247,0.12)]">
            <iframe
              title="Mapa do Autódromo de Interlagos"
              src="https://www.google.com/maps?q=Autódromo+de+Interlagos&output=embed"
              className="min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Tipos de ingresso com decisão mais clara
            </h2>
            <p className="mt-3 text-white/65">
              Cards com conteúdo mais objetivo, largura fluida e CTA consistente
              para reduzir atrito na jornada de compra.
            </p>
          </div>
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            {liveSoldCount.toLocaleString('pt-BR')} ingressos vendidos até agora
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ticketSummaries.map((ticket) => (
            <article
              key={ticket.id}
              className="flex h-full flex-col rounded-4xl border border-white/10 bg-zinc-950/85 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold neon-text">
                    {ticket.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    {ticket.description}
                  </p>
                </div>
                {ticket.highlight && (
                  <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
                    {ticket.highlight}
                  </span>
                )}
              </div>

              <div className="mt-8 space-y-2">
                <p className="text-sm text-white/55">{ticket.currentBatch}</p>
                <p className="text-3xl font-black">
                  {ticket.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <p className="text-sm text-purple-200">
                  {ticket.remaining.toLocaleString('pt-BR')} disponíveis
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  openProtectedRoute(
                    `/ingressos?ticket=${ticket.id}`,
                    'Faça login para comprar ingressos.',
                  )
                }
                className="neon-button mt-8 rounded-full px-5 py-3 text-sm font-bold text-white"
              >
                Escolher ingresso
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-white/10 bg-black/45 p-6 shadow-[0_0_50px_rgba(168,85,247,0.08)] sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Receba novidades do festival
              </h2>
              <p className="mt-3 text-white/65">
                Fluxo de newsletter com validação real, feedback acessível e
                estado de sucesso claro para melhorar confiança do usuário.
              </p>
            </div>

            {!newsletterSubscribed ? (
              <form
                className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]"
                onSubmit={handleNewsletterSubmit}
                noValidate
              >
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    Seu melhor e-mail
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    aria-invalid={Boolean(newsletterError)}
                    aria-describedby={
                      newsletterError ? 'newsletter-error' : undefined
                    }
                    placeholder="voce@empresa.com"
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white placeholder:text-white/35 focus:border-purple-400 focus:outline-none"
                  />
                  {newsletterError && (
                    <p
                      id="newsletter-error"
                      className="mt-2 text-sm text-pink-400"
                    >
                      {newsletterError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-purple-200 lg:self-end"
                >
                  Quero receber novidades
                </button>
              </form>
            ) : (
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <article className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">
                  <p className="text-sm text-white/70">E-mail confirmado</p>
                  <p className="mt-2 font-semibold text-purple-200">
                    {newsletterEmail}
                  </p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-black/40 p-5 text-sm text-white/70">
                  Pré-venda exclusiva e alertas de virada de lote.
                </article>
                <article className="rounded-3xl border border-white/10 bg-black/40 p-5 text-sm text-white/70">
                  Line-up antecipado e experiências VIP especiais.
                </article>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
