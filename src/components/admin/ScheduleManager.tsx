import { useEffect, useState } from "react"
import { store } from "../../modules/admin/store/adminStore"
import { canSchedulePerformance } from "../../modules/admin/schedule/engine/scheduleEngine"
import toast from "react-hot-toast"
import type { Performance } from "../../modules/admin/store/adminStore"

export default function ScheduleManager() {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [artistName, setArtistName] = useState("")
  const [stageId, setStageId] = useState("")
  const [day, setDay] = useState<number | "">("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStart, setEditStart] = useState("")
  const [editEnd, setEditEnd] = useState("")
  const [editName, setEditName] = useState("")
  const [editStageId, setEditStageId] = useState("")
  const [editDay, setEditDay] = useState<number | "">("")
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [filterName, setFilterName] = useState("")
  const [filterStage, setFilterStage] = useState("")
  const [filterDay, setFilterDay] = useState<number | "">("")
  const [filterStart, setFilterStart] = useState("")
  const [filterEnd, setFilterEnd] = useState("")

  function formatName(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

  function createPerformance() {
    const formattedName = formatName(artistName)

    setCurrentPage(1)

    if (!artistName.trim()) {
      toast.error("Digite o nome do artista")
      return
    }

    if (!stageId) {
      toast.error("Selecione um palco")
      return
    }

    if (!day) {
      toast.error("Selecione um dia (28, 29 ou 30)")
      return
    }

    if (!start || !end) {
      toast.error("Defina horário inicial e final")
      return
    }

    if (end <= start) {
      toast.error("O horário final deve ser maior que o inicial")
      return
    }

    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number)
      return h * 60 + m
    }

    const startMin = toMinutes(start)
    const endMin = toMinutes(end)

    const festivalStart = 14 * 60
    const festivalEnd = 16 * 60
    const requiredDuration = 40

    if (startMin < festivalStart || endMin > festivalEnd) {
      toast.error("Shows iniciantes só podem ocorrer entre 14:00 e 16:00")
      return
    }

    if (endMin - startMin !== requiredDuration) {
      toast.error("Shows iniciantes devem ter duração exata de 40 minutos")
      return
    }

    let artist = store.artists.find(
  a => a.name.toLowerCase() === formattedName.toLowerCase()
)

    if (!artist) {
      artist = {
        id: crypto.randomUUID(),
        name: formattedName,
        genre: "Não definido",
        time: start,
        headliner: false,
        newWave: true,
      }

      store.artists.push(artist)
    }

    const perf: Performance = {
      id: crypto.randomUUID(),
      artistId: artist.id,
      stageId,
      day: Number(day),
      start,
      end
    }

    const result = canSchedulePerformance(perf, performances)

if (!result.ok) {
  switch (result.reason) {
    case "STAGE_CONFLICT":
      toast.error("Já existe um show nesse palco nesse horário")
      break

    case "ARTIST_CONFLICT":
      toast.error("Esse artista já tem um show nesse horário")
      break
  }

  return
}

    const updated = [...performances, perf]
setPerformances(updated)
store.performances = updated

    toast.success("Show criado com sucesso 🎉")

    setArtistName("")
    setStageId("")
    setDay("")
    setStart("")
    setEnd("")
  }

  function removePerformance(id: string) {

    setCurrentPage(1)

    const updated = performances.filter(p => p.id !== id)
setPerformances(updated)
store.performances = updated
  }

  function startEdit(p: Performance){
  const artist = store.artists.find(a => a.id === p.artistId)
if (!artist) return null

  setEditingId(p.id)
  setEditStart(p.start)
  setEditEnd(p.end)
  setEditName(artist.name)
  setEditStageId(p.stageId)
  setEditDay(p.day)
}

  function saveEdit(id: string){
  const perf = performances.find(p => p.id === id)
  if (!perf) return

  if (!editName.trim()) {
    toast.error("Nome do artista obrigatório")
    return
  }

  if (!editStageId) {
    toast.error("Selecione um palco")
    return
  }

  if (!editDay) {
    toast.error("Selecione um dia")
    return
  }

  if (!editStart || !editEnd) {
    toast.error("Defina horários")
    return
  }

  if (editEnd <= editStart) {
    toast.error("Horário inválido")
    return
  }

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
  }

  const startMin = toMinutes(editStart)
  const endMin = toMinutes(editEnd)

  const festivalStart = 14 * 60
  const festivalEnd = 16 * 60
  const requiredDuration = 40

  if (startMin < festivalStart || endMin > festivalEnd) {
    toast.error("Shows iniciantes só entre 14:00 e 16:00")
    return
  }

  if (endMin - startMin !== requiredDuration) {
    toast.error("Duração deve ser 40 minutos")
    return
  }

  const updatedPerf: Performance = {
    ...perf,
    stageId: editStageId,
    day: Number(editDay),
    start: editStart,
    end: editEnd
  }

  const others = performances.filter(p => p.id !== id)

  const result = canSchedulePerformance(updatedPerf, others)

  if (!result.ok) {
    if (result.reason === "STAGE_CONFLICT") {
      toast.error("Conflito de palco")
    }
    if (result.reason === "ARTIST_CONFLICT") {
      toast.error("Conflito de artista")
    }
    return
  }

  const updated = performances.map(p =>
    p.id === id ? updatedPerf : p
  )

  const artist = store.artists.find(a => a.id === perf.artistId)
if (artist) {
   artist.name = formatName(editName)
}

  setPerformances(updated)
  store.performances = updated

  setEditingId(null)
  toast.success("Atualizado com sucesso ✨")
}

const filteredPerformances = performances.filter(p => {
  const artist = store.artists.find(a => a.id === p.artistId)

  // filtro nome
  if (filterName && !artist?.name.toLowerCase().includes(filterName.toLowerCase())) {
    return false
  }

  // filtro palco
  if (filterStage && p.stageId !== filterStage) {
    return false
  }

  // filtro dia
  if (filterDay && p.day !== filterDay) {
    return false
  }

  // filtro horário
  if (filterStart && p.start < filterStart) {
    return false
  }

  if (filterEnd && p.end > filterEnd) {
    return false
  }

  return true
})

const totalPages = Math.ceil(filteredPerformances.length / ITEMS_PER_PAGE)

useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }
}, [currentPage, totalPages])

const paginatedPerformances = filteredPerformances.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
)

  return (
    <section className="bg-zinc-950 w-full min-h-screen">

      <div className="min-h-screen text-white py-14">
    <div className="flex">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
            Programação de Evento
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Organize os horários e palcos do festival.
          </p>
        </div>
      </div>

        <div className="w-full from-purple-900/30 to-zinc-900 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-10 shadow-[0_0_30px_rgba(168,85,247,0.25)] mb-16">

        <div className="grid md:grid-cols-5 gap-4 mb-10">

  <input
    placeholder="Buscar artista"
    value={filterName}
    onChange={e => {
      setFilterName(e.target.value)
      setCurrentPage(1)
    }}
    className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
  />

  <select
    value={filterStage}
    onChange={e => {
      setFilterStage(e.target.value)
      setCurrentPage(1)
    }}
    className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
  >
    <option value="">Todos palcos</option>
    {store.stages
  .filter(s => !s.blocked)
  .filter(s => 
    !["Palco A", "Palco B", "Palco Alternativo", "Palco Eletrônico"]
      .includes(s.name)
  )
  .map(s => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
))}
  </select>

  <select
    value={filterDay}
    onChange={e => {
      const value = e.target.value
      setFilterDay(value === "" ? "" : Number(value))
      setCurrentPage(1)
    }}
    className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
  >
    <option value="">Todos dias</option>
    <option value={28}>28</option>
    <option value={29}>29</option>
    <option value={30}>30</option>
  </select>

  <input
    type="time"
    value={filterStart}
    onChange={e => {
      setFilterStart(e.target.value)
      setCurrentPage(1)
    }}
    className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
  />

  <input
    type="time"
    value={filterEnd}
    onChange={e => {
      setFilterEnd(e.target.value)
      setCurrentPage(1)
    }}
    className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
  />

</div>

          <div className="grid md:grid-cols-3 gap-6">

            <input
              placeholder="Digite o nome do artista"
              value={artistName}
              onChange={e => setArtistName(e.target.value)}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
            />

            <select
              value={stageId}
              onChange={e => setStageId(e.target.value)}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
            >
              <option value="">Selecionar palco</option>
              {store.stages
  .filter(s => s.type === "newWave")
  .filter(s => !s.blocked)
  .map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={day}
              onChange={e => {
                const value = e.target.value
                setDay(value === "" ? "" : Number(value))
              }}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
            >
              <option value="">Selecionar dia</option>
              <option value={28}>28 de Junho</option>
              <option value={29}>29 de Junho</option>
              <option value={30}>30 de Junho</option>
            </select>

            <input
              type="time"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
            />

            <input
              type="time"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none
            focus:border-purple-500
            focus:ring-2 focus:ring-purple-500/40"
            />

            <button
              onClick={createPerformance}
              className="px-6 py-2 rounded-full border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]
          hover:shadow-[0_0_16px_rgba(168,85,247,0.9)] transition cursor-pointer font-medium"
            >
              Criar performance
            </button>

          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {paginatedPerformances.length === 0 ? (
    <p className="text-gray-400 col-span-full text-center mt-10">
      Nenhuma performance encontrada 
    </p>
  ) : (

          paginatedPerformances.map((p) => {

            let artist = store.artists.find(a => a.id === p.artistId)


            const stage = store.stages.find(s => s.id === p.stageId)

            return (
              <div key={p.id} className="bg-zinc-900/70 border border-purple-400/40 rounded-2xl p-6 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]">

                {editingId === p.id ? (
  <div className="space-y-4">

    <input
      value={editName}
      onChange={e => setEditName(e.target.value)}
      placeholder="Nome do artista"
      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
    />

    <div className="grid grid-cols-2 gap-3">

  <select
    value={editStageId}
    onChange={e => setEditStageId(e.target.value)}
    className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
  >
    <option value="">Selecionar palco</option>
    {store.stages
  .filter(s => s.type === "newWave")
  .filter(s => !s.blocked)
  .map(s => (
      <option key={s.id} value={s.id}>
        {s.name}
      </option>
    ))}
  </select>

  <select
    value={editDay}
    onChange={e => {
      const value = e.target.value
      setEditDay(value === "" ? "" : Number(value))
    }}
    className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
  >
    <option value="">Selecionar dia</option>
    <option value={28}>28</option>
    <option value={29}>29</option>
    <option value={30}>30</option>
  </select>

  <input
    type="time"
    value={editStart}
    onChange={e => setEditStart(e.target.value)}
    className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
  />

  <input
    type="time"
    value={editEnd}
    onChange={e => setEditEnd(e.target.value)}
    className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
  />

</div>

    <div className="flex gap-3 pt-2">
      <button
        onClick={() => saveEdit(p.id)}
        className="px-4 py-2 rounded-xl border border-green-400 text-green-400 hover:bg-green-400 hover:text-white cursor-pointer"
      >
        Salvar
      </button>

      <button
        onClick={() => setEditingId(null)}
        className="px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
      >
        Cancelar
      </button>
    </div>

  </div>
) : (
                  <div className="space-y-2">

                    <p className="text-xl font-bold neon-text">
                      {artist?.name}
                    </p>

                    <p className="text-sm text-gray-400">{stage?.name}</p>
                    <p className="neon-text">Dia {p.day}</p>
                    <p className="text-sm text-gray-400">{p.start} - {p.end}</p>

                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button onClick={() => startEdit(p)} className="px-4 py-2 text-sm rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition cursor-pointer">Editar</button>
                  <button onClick={() => removePerformance(p.id)} className="px-4 py-2 text-sm rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer ">Excluir</button>
                </div>

              </div>
            )
          })
        )}

        </div>

        {totalPages > 1 && (
  <div className="flex justify-center mt-10 gap-3">

    {Array.from({ length: totalPages }).map((_, index) => {
      const page = index + 1

      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-2 rounded-lg border transition cursor-pointer
            ${
              currentPage === page
                ? "bg-purple-500 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                : "border-purple-400/40 text-purple-300 hover:bg-purple-500/20"
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
