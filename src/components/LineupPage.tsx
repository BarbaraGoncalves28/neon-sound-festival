import { useMemo, useState } from 'react'
import {
  artists,
  festivalDays,
  getArtistById,
  getStageById,
  performances,
  stages,
} from '../data/festivalData'

type ViewMode = 'grid' | 'timeline'

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const safeHours = hours < 6 ? hours + 24 : hours
  return safeHours * 60 + minutes
}

const timelineStart = 18 * 60
const timelineEnd = 27 * 60
const timelineDuration = timelineEnd - timelineStart

const genreColors: Record<string, string> = {
  Pop: 'border-pink-400/40 bg-pink-500/10 text-pink-100',
  'Pop/Electronic': 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-100',
  'Rap/Hip-Hop': 'border-purple-400/40 bg-purple-500/10 text-purple-100',
  Rap: 'border-purple-400/40 bg-purple-500/10 text-purple-100',
  Rock: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100',
}

export function LineupPage() {
  const [dayFilter, setDayFilter] = useState<number | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredPerformances = useMemo(
    () =>
      performances.filter(
        (performance) => dayFilter === 'all' || performance.day === dayFilter,
      ),
    [dayFilter],
  )

  const artistsCount = useMemo(
    () => new Set(performances.map((performance) => performance.artistId)).size,
    [],
  )

  return (
    <div className="min-h-screen bg-black px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-purple-300">
            Programação oficial
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Line-up 
          </h1>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <article className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
            <p className="text-3xl font-bold neon-text">
              {festivalDays.length}
            </p>
            <p className="mt-2 text-sm text-white/65">Dias de festival</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
            <p className="text-3xl font-bold neon-text">{stages.length}</p>
            <p className="mt-2 text-sm text-white/65">Palcos ativos</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
            <p className="text-3xl font-bold neon-text">+{artistsCount}</p>
            <p className="mt-2 text-sm text-white/65">Artistas na grade</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
            <p className="text-3xl font-bold neon-text">
              {filteredPerformances.length}
            </p>
            <p className="mt-2 text-sm text-white/65">
              Shows exibidos no filtro
            </p>
          </article>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {(viewMode === 'timeline'
              ? festivalDays
              : ['all', ...festivalDays]
            ).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setDayFilter(day as number | 'all')}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                  dayFilter === day
                    ? 'border-purple-400 bg-purple-500/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/65 hover:border-purple-400/40 hover:bg-white/10 cursor-pointer'
                }`}
              >
                {day === 'all' ? 'Todos os dias' : `Dia ${day}`}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('timeline')
                if (dayFilter === 'all') {
                  setDayFilter(festivalDays[0])
                }
              }}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'timeline'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {viewMode === 'grid' && (
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPerformances.map((performance) => {
              const artist = getArtistById(performance.artistId)
              const stage = getStageById(performance.stageId)

              if (!artist || !stage) return null

              return (
                <article
                  key={performance.id}
                  className="group overflow-hidden rounded-4xl border border-white/10 bg-zinc-950/80 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={artist.image}
                      alt={`${artist.name}, artista do gênero ${artist.genre}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-purple-200">
                        Dia {performance.day}
                      </p>
                      <h2 className="mt-3 text-2xl font-bold">{artist.name}</h2>
                    </div>
                  </div>

                  <div className="space-y-3 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-white/55">
                      {artist.genre}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {stage.name}
                      </span>
                      <span>
                        {performance.start} — {performance.end}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}

        {viewMode === 'timeline' && (
          <section className="mt-10 overflow-x-auto rounded-4xl border border-white/10 bg-zinc-950/80 p-4 shadow-[0_0_40px_rgba(168,85,247,0.08)] sm:p-6">
            <div className="min-w-220">
              <div className="grid grid-cols-[170px_1fr] border-b border-white/10 pb-4">
                <div />
                <div className="relative h-8">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const hour = 18 + index
                    const displayHour = hour >= 24 ? hour - 24 : hour
                    const left =
                      ((hour * 60 - timelineStart) / timelineDuration) * 100

                    return (
                      <span
                        key={hour}
                        className={`absolute top-0 text-xs text-white/55 ${
                          index === 0
                            ? 'translate-x-0'
                            : index === 9
                              ? '-translate-x-full'
                              : '-translate-x-1/2'
                        }`}
                        style={{ left: `${left}%` }}
                      >
                        {displayHour}:00
                      </span>
                    )
                  })}
                </div>
              </div>

              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="grid grid-cols-[170px_1fr] border-b border-white/10 last:border-b-0"
                >
                  <div className="flex items-center py-6 pr-4 text-sm font-semibold text-purple-200">
                    {stage.name}
                  </div>
                  <div className="relative min-h-24 py-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <span
                        key={index}
                        className="absolute bottom-0 top-0 border-l border-white/10"
                        style={{ left: `${(index / 9) * 100}%` }}
                      />
                    ))}

                    {filteredPerformances
                      .filter((performance) => performance.stageId === stage.id)
                      .map((performance) => {
                        const artist = artists.find(
                          (currentArtist) =>
                            currentArtist.id === performance.artistId,
                        )
                        if (!artist) return null

                        const left =
                          ((timeToMinutes(performance.start) - timelineStart) /
                            timelineDuration) *
                          100
                        const width =
                          ((timeToMinutes(performance.end) -
                            timeToMinutes(performance.start)) /
                            timelineDuration) *
                          100
                        const colorClasses =
                          genreColors[artist.genre] ??
                          'border-white/10 bg-white/10 text-white'

                        return (
                          <article
                            key={performance.id}
                            className={`absolute top-3 flex min-h-14 items-center gap-3 overflow-hidden rounded-2xl border px-3 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(0,0,0,0.2)] ${colorClasses}`}
                            style={{
                              left: `${left}%`,
                              width: `${Math.max(width, 12)}%`,
                            }}
                          >
                            <img
                              src={artist.image}
                              alt={artist.name}
                              className="h-8 w-8 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate">{artist.name}</p>
                              <p className="truncate text-[11px] text-white/60">
                                {performance.start} — {performance.end}
                              </p>
                            </div>
                          </article>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default LineupPage
