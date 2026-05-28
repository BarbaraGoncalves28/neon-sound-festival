import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  artists,
  eventHistory,
  getArtistById,
  getStageById,
  performances,
} from '../data/festivalData'

/* =========================
   TYPES
========================= */

type Ticket = {
  id: string
  type: string
  day: number
  qr: string
  ownerEmail: string
}

/* =========================
   COMPONENT
========================= */

export default function MeusIngressos() {
  const [tickets] = useState<Ticket[]>(() =>
    JSON.parse(localStorage.getItem('tickets') || '[]'),
  )
  const [favorites, setFavorites] = useState<string[]>([])

  /* =========================
   FAVORITES
========================= */

  function toggleFavorite(id: string) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const favoritePerformances = useMemo(
    () =>
      performances.filter((performance) =>
        favorites.includes(performance.artistId),
      ),
    [favorites],
  )

  /* =========================
   NOTIFICATION SYSTEM
========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()

      favoritePerformances.forEach((perf) => {
        const start =
          Number(perf.start.split(':')[0]) * 60 +
          Number(perf.start.split(':')[1])

        if (start - currentTime === 10) {
          const artist = getArtistById(perf.artistId)
          const stage = getStageById(perf.stageId)

          toast(
            `${artist?.name} começa em 10 minutos no ${stage?.name ?? perf.stageId}!`,
            {
              icon: '🎤',
            },
          )
        }
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [favoritePerformances])

  function removeFromFavorites(artistId: string) {
    setFavorites((prev) => prev.filter((id) => id !== artistId))
  }

  /* =========================
   RENDER
========================= */

  return (
    <div className="bg-black text-white min-h-screen px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full space-y-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center neon-text mt-10">
          Meus Ingressos
        </h2>

        {/* =========================
   MEUS INGRESSOS
========================= */}

        <section>
          <div className="max-w-7xl mx-auto">
            {tickets.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">
                Você ainda não comprou nenhum ingresso
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-zinc-900 border border-purple-500 rounded-2xl p-3
shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                  >
                    {/* HEADER DO INGRESSO */}

                    <h3 className="text-lg font-bold neon-text text-center mb-1">
                      Neon Sound Festival
                    </h3>

                    <p className="text-center text-gray-400 text-xs mb-4">
                      Dia {ticket.day} • {ticket.type}
                    </p>

                    {/* QR CODE */}

                    <div className="bg-white p-2 rounded-lg w-fit mx-auto">
                      <img
                        src={ticket.qr}
                        alt={`QR Code do ingresso ${ticket.id}`}
                        className="w-24"
                      />
                    </div>

                    <p className="text-center text-gray-400 text-xs mt-3">
                      Apresente este QR Code na entrada
                    </p>

                    {/* INFO DO INGRESSO */}

                    <div className="mt-4 text-xs space-y-1 text-gray-400">
                      <p>
                        <b className="neon-text">ID:</b> {ticket.id}
                      </p>

                      <p>
                        <b className="neon-text">Email:</b> {ticket.ownerEmail}
                      </p>

                      <p>
                        <b className="neon-text">Tipo:</b> {ticket.type}
                      </p>
                    </div>

                    {/* AÇÕES */}

                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={ticket.qr}
                        download
                        className="text-center py-2 hover:bg-purple-600     mt-6 px-4 rounded-full border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] transition cursor-pointer neon-text neon-button duration-300  font-bold
"
                      >
                        Baixar QR Code
                      </a>

                      <div className="flex gap-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================
   FAVORITE ARTISTS
========================= */}

        <section className="bg-zinc-950 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
                Artistas Favoritos
              </h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                Marque seus artistas preferidos para receber alertas antes do
                show começar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  className="border border-purple-400 p-3 rounded-lg"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-16 object-cover rounded"
                  />

                  <div className="mt-2">
                    <h3 className="font-semibold text-sm neon-text">
                      {artist.name}
                    </h3>

                    <p className="text-xs text-gray-400">{artist.genre}</p>

                    <button
                      onClick={() => toggleFavorite(artist.id)}
                      className={`cursor-pointer mt-2 px-2 py-1 text-xs rounded ${
                        favorites.includes(artist.id)
                          ? 'bg-purple-700'
                          : 'bg-purple-400'
                      }`}
                    >
                      {favorites.includes(artist.id)
                        ? 'Favoritado'
                        : 'Favoritar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* =========================
   MINHA PROGRAMAÇÃO
========================= */}

            <section className="py-24">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center neon-text mt-20">
                  Minha Programação
                </h2>

                <div className="space-y-4 mt-5">
                  {favoritePerformances.map((perf, i) => {
                    const artist = getArtistById(perf.artistId)
                    const stage = getStageById(perf.stageId)

                    return (
                      <div
                        key={i}
                        className="border border-purple-500/40 p-4 rounded-xl flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
                      >
                        <div>
                          <h3 className="font-bold neon-text">
                            {artist?.name}
                          </h3>

                          <p className="text-sm text-gray-400">
                            {stage?.name ?? perf.stageId}
                          </p>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="neon-text font-semibold">
                              Dia {perf.day}
                            </p>
                            <p className="text-gray-400">{perf.start}</p>
                          </div>
                          <button
                            onClick={() => removeFromFavorites(perf.artistId)}
                            aria-label={`Remover ${artist?.name ?? 'artista'} dos favoritos`}
                            className="text-red-400 hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* =========================
   HISTÓRICO DE EVENTOS
========================= */}

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
                Eventos que você participou
              </h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                Reviva os festivais que fizeram parte da sua jornada musical.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {eventHistory.map((event) => (
                <div
                  key={event.id}
                  className="border border-purple-500/40 p-5 rounded-xl text-center
hover:border-purple-400 transition"
                >
                  <img
                    src={event.logo}
                    alt={event.name}
                    className="h-12 mx-auto mb-4 object-contain rounded-full"
                  />

                  <h3 className="neon-text font-semibold">{event.name}</h3>

                  <p className="text-gray-400">{event.city}</p>

                  <strong className="neon-text">{event.year}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
