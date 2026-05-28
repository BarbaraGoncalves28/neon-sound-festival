import { useState } from 'react'
import toast from 'react-hot-toast'
import { saveStoredStages } from '../../modules/admin/store/adminPersistence'
import type { Stage } from '../../modules/admin/store/adminStore'
import { setStoreStages, store } from '../../modules/admin/store/adminStore'

export default function StagesManager() {
  const [stages, setStages] = useState(store.stages)
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCapacity, setEditCapacity] = useState(0)
  const [filterName, setFilterName] = useState('')
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  function createStage() {
    if (!name.trim()) return
    if (!capacity || capacity <= 0) return

    const normalizedName = normalizeStageName(name)

    const alreadyExists = store.stages.some(
      (s) => s.name.trim().toLowerCase() === normalizedName,
    )

    if (alreadyExists) {
      toast.error('Já existe um palco com esse nome')

      setName('')
      setCapacity('')

      return
    }

    const stage: Stage = {
      id: crypto.randomUUID(),
      name: normalizeStageName(name),
      capacity,
      type: 'newWave',
      blocked: false,
    }

    const updatedStages = [...store.stages, stage]

    setStoreStages(updatedStages)
    saveStoredStages(updatedStages)
    setStages(updatedStages)

    setName('')
    setCapacity('')
  }

  function toggleBlock(id: string) {
    const stage = store.stages.find((s) => s.id === id)
    if (!stage) return

    stage.blocked = !stage.blocked

    saveStoredStages(store.stages)
    setStages([...store.stages])
  }

  const filteredStages = stages
    .filter((stage) => stage.type === 'newWave')
    .filter((stage) => {
      if (
        filterName &&
        !stage.name.toLowerCase().includes(filterName.toLowerCase())
      ) {
        return false
      }
      return true
    })

  const totalPages = Math.ceil(filteredStages.length / ITEMS_PER_PAGE)
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1

  const paginatedStages = filteredStages.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  )

  function deleteStage(id: string) {
    const updatedStages = store.stages.filter((s) => s.id !== id)

    setStoreStages(updatedStages)
    saveStoredStages(updatedStages)
    setStages(updatedStages)
  }

  function startEdit(stage: Stage) {
    setEditingId(stage.id)
    setEditName(stage.name)
    setEditCapacity(stage.capacity)
  }

  function saveEdit(id: string) {
    const stage = store.stages.find((s) => s.id === id)
    if (!stage) return

    const normalizedName = normalizeStageName(editName)

    const alreadyExists = store.stages.some(
      (s) => s.id !== id && s.name.trim().toLowerCase() === normalizedName,
    )

    if (alreadyExists) {
      toast.error('Já existe um palco com esse nome')
      return
    }

    stage.name = normalizeStageName(editName)
    stage.capacity = editCapacity

    saveStoredStages(store.stages)
    setStages([...store.stages])
    setEditingId(null)
  }

  function formatName(name: string) {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  function normalizeStageName(name: string) {
    const trimmed = name.trim().toLowerCase()

    const finalName = trimmed.startsWith('palco ')
      ? trimmed
      : `palco ${trimmed}`

    return formatName(finalName)
  }

  return (
    <section className="bg-zinc-950 w-full min-h-screen">
      <div className="min-h-screen text-white py-14">
        {/* HEADER */}
        <div className="flex">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold neon-text">
              Gerencie os Palcos
            </h2>
            <p className="text-gray-400 mt-3">
              Gerencie os palcos do festival.
            </p>
          </div>
        </div>

        {/* ================= CRIAR PALCO ================= */}
        <div
          className="
         from-purple-900/30 to-zinc-900
        border border-purple-500/40
        backdrop-blur-xl
        rounded-2xl
        p-8
        mb-16
        shadow-[0_0_25px_rgba(168,85,247,0.25)]
      "
        >
          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Nome do palco"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
            bg-black/60
            border border-purple-500/30
            rounded-xl
            px-4 py-3
            focus:outline-none
            focus:border-purple-500
            focus:ring-2 focus:ring-purple-500/40
            transition
          "
            />

            <input
              type="number"
              placeholder="Capacidade"
              value={capacity}
              onChange={(e) =>
                setCapacity(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="
            bg-black/60
            border border-purple-500/30
            rounded-xl
            px-4 py-3
            focus:outline-none
            focus:border-purple-500
            focus:ring-2 focus:ring-purple-500/40
            transition
          "
            />

            <button
              onClick={createStage}
              className="px-6 py-2 rounded-full border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]
          hover:shadow-[0_0_16px_rgba(168,85,247,0.9)] transition cursor-pointer font-medium"
            >
              Criar palco
            </button>
          </div>

          <div className="mb-6">
            <input
              placeholder="Buscar palco"
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 w-full md:w-1/4 mt-5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40
    "
            />
          </div>
        </div>

        {/* ================= LISTA DE PALCOS ================= */}

        <div className="grid md:grid-cols-2 gap-8">
          {paginatedStages.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center mt-10">
              Nenhum palco encontrado
            </p>
          ) : (
            paginatedStages.map((s) => (
              <div
                key={s.id}
                className={`
            group
            relative
            rounded-2xl
            p-6
            border
            backdrop-blur-lg
            transition duration-300
            ${
              s.blocked
                ? 'bg-red-900/20 border-red-500/50'
                : 'bg-zinc-900/70 border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]'
            }
          `}
              >
                <div className="space-y-2">
                  {editingId === s.id ? (
                    <div className="space-y-3">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
                      />

                      <input
                        type="number"
                        value={editCapacity}
                        onChange={(e) =>
                          setEditCapacity(Number(e.target.value))
                        }
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
                      />

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => saveEdit(s.id)}
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
                    <>
                      <p className="text-xl font-bold group-hover:text-purple-400 transition neon-text">
                        {formatName(s.name)}
                      </p>

                      <p className="text-sm text-gray-400">
                        Capacidade: {s.capacity.toLocaleString()} pessoas
                      </p>

                      {s.blocked && (
                        <span
                          className="
          inline-block
          text-xs
          font-semibold
          bg-red-500/20
          text-red-400
          px-3 py-1
          rounded-full
          border border-red-500/40
        "
                        >
                          Palco bloqueado
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  {/* BLOQUEAR */}
                  <button
                    onClick={() => toggleBlock(s.id)}
                    className={`
      px-4 py-2 text-sm rounded-xl border transition cursor-pointer
      ${
        s.blocked
          ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
          : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
      }
    `}
                  >
                    {s.blocked ? 'Desbloquear' : 'Bloquear'}
                  </button>

                  {/* EDITAR */}
                  <button
                    onClick={() => startEdit(s)}
                    className="px-4 py-2 text-sm rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition cursor-pointer"
                  >
                    Editar
                  </button>

                  {/* EXCLUIR */}
                  <button
                    onClick={() => deleteStage(s.id)}
                    className="px-4 py-2 text-sm rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
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
              safeCurrentPage === page
                ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                : 'border-purple-400/40 text-purple-300 hover:bg-purple-500/20'
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
