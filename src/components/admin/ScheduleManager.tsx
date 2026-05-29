import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { canSchedulePerformance } from '../../modules/admin/schedule/engine/scheduleEngine'
import {
  getDefaultArtists,
  saveStoredArtists,
  saveStoredPerformances,
} from '../../modules/admin/store/adminPersistence'
import type { Performance } from '../../modules/admin/store/adminStore'
import {
  setStoreArtists,
  setStorePerformances,
  store,
} from '../../modules/admin/store/adminStore'

export default function ScheduleManager() {
  const [performances, setPerformances] = useState<Performance[]>(
    () => store.performances,
  )

  // CREATE
  const [artistName, setArtistName] = useState('')
  const [stageId, setStageId] = useState('')
  const [day, setDay] = useState<number | ''>('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // EDIT
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')
  const [editName, setEditName] = useState('')
  const [editStageId, setEditStageId] = useState('')
  const [editDay, setEditDay] = useState<number | ''>('')

  // FILTERS
  const [filterName, setFilterName] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterDay, setFilterDay] = useState<number | ''>('')
  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd] = useState('')

  // PAGINATION
  const ITEMS_PER_PAGE = 5
  const [currentPage, setCurrentPage] = useState(1)
  const defaultArtistIds = useMemo(
    () => new Set(getDefaultArtists().map((artist) => artist.id)),
    [],
  )

  function formatName(name: string) {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const existingArtist = useMemo(() => {
    return store.artists.find(
      (a) => a.name.toLowerCase() === artistName.toLowerCase(),
    )
  }, [artistName])

  function validatePerformance(
    artist: string,
    stage: string,
    selectedDay: number | '',
    initial: string,
    final: string,
  ) {
    if (!artist.trim()) {
      toast.error('Digite o nome do artista')
      return false
    }

    if (!stage) {
      toast.error('Selecione um palco')
      return false
    }

    if (!selectedDay) {
      toast.error('Selecione um dia')
      return false
    }

    if (!initial || !final) {
      toast.error('Defina os horários')
      return false
    }

    if (final <= initial) {
      toast.error('O horário final deve ser maior')
      return false
    }

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number)
      return h * 60 + m
    }

    const startMin = toMinutes(initial)
    const endMin = toMinutes(final)

    const festivalStart = 14 * 60
    const festivalEnd = 16 * 60
    const requiredDuration = 40

    if (startMin < festivalStart || endMin > festivalEnd) {
      toast.error('Shows iniciantes só podem ocorrer entre 14h e 16h')
      return false
    }

    if (endMin - startMin !== requiredDuration) {
      toast.error('Shows iniciantes devem durar 40 minutos')
      return false
    }

    return true
  }

  function createPerformance() {
    setCurrentPage(1)

    const valid = validatePerformance(artistName, stageId, day, start, end)

    if (!valid) return

    const formattedName = formatName(artistName)

    const matchedArtist = store.artists.find(
      (a) => a.name.toLowerCase() === formattedName.toLowerCase(),
    )

    const artist = matchedArtist ?? {
      id: crypto.randomUUID(),
      name: formattedName,
      genre: 'Não definido',
      time: start,
      day: Number(day),
      headliner: false,
      newWave: true,
    }

    const perf: Performance = {
      id: crypto.randomUUID(),
      artistId: artist.id,
      stageId,
      day: Number(day),
      start,
      end,
    }

    const result = canSchedulePerformance(perf, performances)

    if (!result.ok) {
      switch (result.reason) {
        case 'STAGE_CONFLICT':
          toast.error('Já existe show nesse palco nesse horário')
          break

        case 'ARTIST_CONFLICT':
          toast.error('Esse artista já possui show nesse horário')
          break
      }

      return
    }

    if (!matchedArtist) {
      const updatedArtists = [...store.artists, artist]

      setStoreArtists(updatedArtists)
      saveStoredArtists(updatedArtists)
    }

    const updated = [...performances, perf]

    setStorePerformances(updated)
    saveStoredPerformances(updated)
    setPerformances(updated)

    toast.success(
      existingArtist
        ? 'Performance criada com sucesso 🎉'
        : 'Artista e performance criados 🎉',
    )

    setArtistName('')
    setStageId('')
    setDay('')
    setStart('')
    setEnd('')
  }

  function removeArtistFromStorage(artistId: string) {
    if (defaultArtistIds.has(artistId)) {
      return false
    }

    const updatedArtists = store.artists.filter(
      (artist) => artist.id !== artistId,
    )

    setStoreArtists(updatedArtists)
    saveStoredArtists(updatedArtists)

    return true
  }

  function removePerformance(id: string) {
    const performanceToRemove = performances.find((p) => p.id === id)
    const updated = performances.filter((p) => p.id !== id)

    setStorePerformances(updated)
    saveStoredPerformances(updated)
    setPerformances(updated)

    if (performanceToRemove) {
      const stillHasPerformances = updated.some(
        (performance) => performance.artistId === performanceToRemove.artistId,
      )

      if (!stillHasPerformances) {
        removeArtistFromStorage(performanceToRemove.artistId)
      }
    }

    toast.success('Performance removida')
  }

  function removeOrphanArtist(artistId: string) {
    const removed = removeArtistFromStorage(artistId)

    if (!removed) {
      toast.error('Os artistas padrão do festival não podem ser removidos')
      return
    }

    toast.success('Artista removido')
  }

  function startEdit(p: Performance) {
    const artist = store.artists.find((a) => a.id === p.artistId)

    if (!artist) return

    setEditingId(p.id)
    setEditName(artist.name)
    setEditStageId(p.stageId)
    setEditDay(p.day)
    setEditStart(p.start)
    setEditEnd(p.end)
  }

  function saveEdit(id: string) {
    const perf = performances.find((p) => p.id === id)

    if (!perf) return

    const valid = validatePerformance(
      editName,
      editStageId,
      editDay,
      editStart,
      editEnd,
    )

    if (!valid) return

    const updatedPerf: Performance = {
      ...perf,
      stageId: editStageId,
      day: Number(editDay),
      start: editStart,
      end: editEnd,
    }

    const others = performances.filter((p) => p.id !== id)

    const result = canSchedulePerformance(updatedPerf, others)

    if (!result.ok) {
      if (result.reason === 'STAGE_CONFLICT') {
        toast.error('Conflito de palco')
      }

      if (result.reason === 'ARTIST_CONFLICT') {
        toast.error('Conflito de artista')
      }

      return
    }

    const artist = store.artists.find((a) => a.id === perf.artistId)

    if (artist) {
      artist.name = formatName(editName)
      saveStoredArtists(store.artists)
    }

    const updated = performances.map((p) => (p.id === id ? updatedPerf : p))

    setStorePerformances(updated)
    saveStoredPerformances(updated)
    setPerformances(updated)

    setEditingId(null)

    toast.success('Performance atualizada ✨')
  }

  const filteredPerformances = performances.filter((p) => {
    const artist = store.artists.find((a) => a.id === p.artistId)

    if (
      filterName &&
      !artist?.name.toLowerCase().includes(filterName.toLowerCase())
    ) {
      return false
    }

    if (filterStage && p.stageId !== filterStage) {
      return false
    }

    if (filterDay && p.day !== filterDay) {
      return false
    }

    if (filterStart && p.start < filterStart) {
      return false
    }

    if (filterEnd && p.end > filterEnd) {
      return false
    }

    return true
  })

  const artistsWithPerformance = new Set(performances.map((p) => p.artistId))

  const filteredOrphanArtists = store.artists.filter((artist) => {
    if (artistsWithPerformance.has(artist.id)) {
      return false
    }

    if (
      filterName &&
      !artist.name.toLowerCase().includes(filterName.toLowerCase())
    ) {
      return false
    }

    if (filterStage) {
      return false
    }

    if (filterDay && artist.day !== filterDay) {
      return false
    }

    if (filterStart && (artist.time ?? '') < filterStart) {
      return false
    }

    if (filterEnd && (artist.time ?? '') > filterEnd) {
      return false
    }

    return true
  })

  const totalPages = Math.ceil(filteredPerformances.length / ITEMS_PER_PAGE)

  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1

  const paginatedPerformances = filteredPerformances.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  )

  return (
    <section className="bg-zinc-950 w-full min-h-screen">
      <div className="min-h-screen text-white py-14">
        {/* HEADER */}
        <div className="flex">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">
              Gerenciar Artistas
            </h2>

            <p className="text-gray-400 mt-3">
              Cadastre artistas, vincule horários e organize os palcos do
              festival.
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-zinc-900/50 border border-purple-500/30 rounded-3xl p-8 mb-14">
          <div className="mb-8">
            <h3 className="text-2xl font-bold neon-text">Buscar artistas</h3>

            <p className="text-gray-400 mt-2">
              Filtre os cadastros por artista, palco, dia ou horário.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <input
              placeholder="Buscar artista"
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-purple-500/40
  focus:border-purple-500"
            />

            <select
              value={filterStage}
              onChange={(e) => {
                setFilterStage(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 cursor-pointer outline-none
  focus:outline-none
  focus:ring-2
  focus:ring-purple-500/40
  focus:border-purple-500"
            >
              <option value="">Todos palcos</option>

              {store.stages
                .filter((s) => !s.blocked)
                .map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
            </select>

            <select
              value={filterDay}
              onChange={(e) => {
                const value = e.target.value
                setFilterDay(value === '' ? '' : Number(value))
              }}
              className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 cursor-pointer outline-none
  focus:outline-none
  focus:ring-2
  focus:ring-purple-500/40
  focus:border-purple-500"
            >
              <option value="">Todos dias</option>
              <option value={28}>28 Junho</option>
              <option value={29}>29 Junho</option>
              <option value={30}>30 Junho</option>
            </select>

            <input
              type="time"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
              className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
            />

            <input
              type="time"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
              className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 outline-none
  focus:outline-none
  focus:ring-2
  focus:ring-purple-500/40
  focus:border-purple-500"
            />
          </div>
        </div>

        {/* CREATE */}
        <div className="bg-zinc-900/50 border border-purple-500/30 rounded-3xl p-8 mb-14">
          <div className="mb-10">
            <h3 className="text-2xl font-bold neon-text">Gerenciar Artistas</h3>

            <p className="text-gray-400 mt-2">
              Use a base inicial da home como referência e adicione novos
              artistas por aqui.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ARTIST */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                Artista
              </label>

              <input
                placeholder="Cadastrar um novo artista"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
              />

              {artistName.trim() && (
                <div className="mt-3 text-sm">
                  {existingArtist ? (
                    <p className="text-green-400">
                      ✓ Artista encontrado no sistema
                    </p>
                  ) : (
                    <p className="text-yellow-400">
                      + Um novo artista será criado automaticamente
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* STAGE */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Palco</label>

              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 cursor-pointer outline-none
  focus:outline-none
  focus:ring-2
  focus:ring-purple-500/40
  focus:border-purple-500"
              >
                <option value="">Selecionar palco</option>

                {store.stages
                  .filter((s) => s.type === 'newWave')
                  .filter((s) => !s.blocked)
                  .map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* DAY */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Dia</label>

              <select
                value={day}
                onChange={(e) => {
                  const value = e.target.value
                  setDay(value === '' ? '' : Number(value))
                }}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 cursor-pointer outline-none
  focus:outline-none
  focus:ring-2
  focus:ring-purple-500/40
  focus:border-purple-500"
              >
                <option value="">Selecionar dia</option>
                <option value={28}>28 Junho</option>
                <option value={29}>29 Junho</option>
                <option value={30}>30 Junho</option>
              </select>
            </div>

            {/* START */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Horário Inicial
              </label>

              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 outline-none
  focus:outline-none
  focus:ring-2
  focus:ring-purple-500/40
  focus:border-purple-500"
              />
            </div>

            {/* END */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Horário Final
              </label>

              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
              />
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-6 mt-10">
            <h4 className="font-bold neon-text mb-4">Resumo do cadastro</h4>

            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Artista</p>
                <p className="text-white mt-1">{artistName || '—'}</p>
              </div>

              <div>
                <p className="text-gray-400">Palco</p>
                <p className="text-white mt-1">
                  {store.stages.find((s) => s.id === stageId)?.name || '—'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Dia</p>
                <p className="text-white mt-1">{day || '—'}</p>
              </div>

              <div>
                <p className="text-gray-400">Horário</p>
                <p className="text-white mt-1">
                  {start || '--:--'} - {end || '--:--'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={createPerformance}
            className="mt-8 px-8 py-3 rounded-full border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)] hover:shadow-[0_0_20px_rgba(168,85,247,1)] transition font-medium cursor-pointer"
          >
            {existingArtist
              ? 'Salvar apresentação'
              : 'Criar artista e apresentação'}
          </button>
        </div>

        {/* LIST */}
        <div>
          <div className="mb-10">
            <h3 className="text-2xl font-bold neon-text">
              Artistas na programação
            </h3>

            <p className="text-gray-400 mt-2">
              Acompanhe e edite os artistas já vinculados à grade.
            </p>
          </div>

          {paginatedPerformances.length === 0 &&
          filteredOrphanArtists.length === 0 ? (
            <div className="text-center py-24 border border-zinc-800 rounded-3xl">
              <p className="text-2xl neon-text mb-3">
                Nenhum artista encontrado
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {paginatedPerformances.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {paginatedPerformances.map((p) => {
                    const artist = store.artists.find(
                      (a) => a.id === p.artistId,
                    )

                    const stage = store.stages.find((s) => s.id === p.stageId)

                    return (
                      <div
                        key={p.id}
                        className="bg-zinc-900/70 border border-purple-400/30 rounded-2xl p-6"
                      >
                        {editingId === p.id ? (
                          <div className="space-y-4">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3"
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <select
                                value={editStageId}
                                onChange={(e) => setEditStageId(e.target.value)}
                                className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3"
                              >
                                {store.stages
                                  .filter((s) => s.type === 'newWave')
                                  .map((stage) => (
                                    <option key={stage.id} value={stage.id}>
                                      {stage.name}
                                    </option>
                                  ))}
                              </select>

                              <select
                                value={editDay}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setEditDay(value === '' ? '' : Number(value))
                                }}
                                className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3"
                              >
                                <option value={28}>28</option>
                                <option value={29}>29</option>
                                <option value={30}>30</option>
                              </select>

                              <input
                                type="time"
                                value={editStart}
                                onChange={(e) => setEditStart(e.target.value)}
                                className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3"
                              />

                              <input
                                type="time"
                                value={editEnd}
                                onChange={(e) => setEditEnd(e.target.value)}
                                className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3"
                              />
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => saveEdit(p.id)}
                                className="px-4 py-2 rounded-xl border border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition"
                              >
                                Salvar
                              </button>

                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <p className="text-2xl font-bold neon-text">
                                {artist?.name}
                              </p>

                              <p className="text-gray-400">{stage?.name}</p>

                              <p className="text-purple-300">Dia {p.day}</p>

                              <p className="text-gray-400">
                                {p.start} - {p.end}
                              </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                              <button
                                onClick={() => startEdit(p)}
                                className="cursor-pointer px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => removePerformance(p.id)}
                                className="cursor-pointer px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                              >
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {filteredOrphanArtists.length > 0 && (
                <div>
                  <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                    <h4 className="text-lg font-semibold text-yellow-300">
                      Artistas salvos sem apresentação vinculada
                    </h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {filteredOrphanArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className="bg-zinc-900/70 border border-yellow-500/30 rounded-2xl p-6"
                      >
                        <div className="space-y-2">
                          <p className="text-2xl font-bold neon-text">
                            {artist.name}
                          </p>

                          <p className="text-gray-400">Palco não vinculado</p>

                          <p className="text-purple-300">
                            {artist.day
                              ? `Dia ${artist.day}`
                              : 'Dia não informado'}
                          </p>

                          <p className="text-gray-400">
                            {artist.time
                              ? `${artist.time} - horário inicial salvo`
                              : 'Horário não informado'}
                          </p>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => removeOrphanArtist(artist.id)}
                            className="cursor-pointer px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-14">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl border transition
                    ${
                      safeCurrentPage === page
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'border-purple-500/40 text-purple-300 hover:bg-purple-500/20'
                    }
                  `}
                >
                  {page}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
