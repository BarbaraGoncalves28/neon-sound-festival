import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { store } from './store/adminStore'

const TICKET_PRICES = {
  pista: 650,
  vip: 1200,
  passaporte: 1650,
  meia: 325,
  backstage: 2500,
} as const

export function AdminDashboardReal() {
  // ==============================
  // 🎟 SIMULAÇÃO AO VIVO DOS LOTES
  // ==============================

  const [liveTypes, setLiveTypes] = useState(() =>
    store.ticketTypes.map((type) => ({
      ...type,
      phases: type.phases.map((phase) => ({
        ...phase,
        sold: phase.sold, // começa com 70%
        status: 'active',
      })),
    })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTypes((prev) =>
        prev.map((type) => ({
          ...type,
          phases: type.phases.map((phase) => {
            if (phase.sold >= phase.limit) {
              return { ...phase, status: 'soldout' }
            }

            const increase = Math.floor(Math.random() * 4) + 1
            const newSold = Math.min(phase.sold + increase, phase.limit)
            const progress = (newSold / phase.limit) * 100

            let newStatus = 'active'
            if (progress >= 100) newStatus = 'soldout'
            else if (progress >= 85) newStatus = 'almost'

            return {
              ...phase,
              sold: newSold,
              status: newStatus,
            }
          }),
        })),
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  // ========= SIMULAÇÃO RECEITA TOTAL
  const MAX_TICKETS = 280000

  const [simulatedRevenue, setSimulatedRevenue] = useState(118000000)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const simulateRevenue = () => {
      setSimulatedRevenue((prev) => {
        // Simula venda de 10 a 120 ingressos por atualização
        const totalSoldNow = Math.floor(Math.random() * 110) + 10

        // Distribuição percentual realista
        const pistaQty = Math.floor(totalSoldNow * 0.45)
        const vipQty = Math.floor(totalSoldNow * 0.25)
        const passaporteQty = Math.floor(totalSoldNow * 0.15)
        const meiaQty = Math.floor(totalSoldNow * 0.1)
        const backstageQty = Math.floor(totalSoldNow * 0.05)

        const increase =
          pistaQty * TICKET_PRICES.pista +
          vipQty * TICKET_PRICES.vip +
          passaporteQty * TICKET_PRICES.passaporte +
          meiaQty * TICKET_PRICES.meia +
          backstageQty * TICKET_PRICES.backstage

        return prev + increase
      })

      const nextDelay = Math.random() * 2000 + 400
      timeout = setTimeout(simulateRevenue, nextDelay)
    }

    simulateRevenue()

    return () => clearTimeout(timeout)
  }, [])

  // =========== SIMULAÇÃO INGRESSOS VENDIDOS
  const [simulatedSold, setSimulatedSold] = useState(220552)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const updateSales = () => {
      setSimulatedSold((prev) => {
        if (prev >= MAX_TICKETS) return prev

        const randomIncrease = Math.floor(Math.random() * 120) + 10

        return Math.min(prev + randomIncrease, MAX_TICKETS)
      })

      const nextDelay = Math.random() * 2000 + 400
      timeout = setTimeout(updateSales, nextDelay)
    }

    updateSales()

    return () => clearTimeout(timeout)
  }, [])

  // ==============================
  // 📊 DADOS DO GRÁFICO
  // ==============================

  const revenueChartData = liveTypes.map((type) => ({
    name: type.name,
    revenue: type.phases.reduce((acc, p) => acc + p.price * p.sold, 0),
  }))

  // ==============================
  // 🎨 BADGE STYLE
  // ==============================

  function getStatusBadge(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/40'
      case 'almost':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40 animate-pulse'
      case 'soldout':
        return 'bg-red-500/20 text-red-400 border-red-500/40'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen text-white">
      {/* CARDS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Receita */}
        <div className="bg-linear-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-md border border-purple-500/40 rounded-2xl p-6">
          <h3 className="text-gray-400 tracking-wider">Receita Total</h3>
          <p className="text-3xl font-bold mt-3">
            R$ {simulatedRevenue.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Ingressos */}
        <div className="bg-linear-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-md border border-purple-500/40 rounded-2xl p-6">
          <h3 className="text-gray-400 tracking-wider">Ingressos Vendidos</h3>
          <p className="text-3xl font-bold mt-3">
            {simulatedSold.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Artistas */}
        <div className="bg-linear-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-md border border-purple-500/40 rounded-2xl p-6">
          <h3 className="text-gray-400 tracking-wider">Todos os Artistas</h3>
          <p className="text-3xl font-bold mt-3">{store.artists.length}</p>
        </div>

        {/* Palcos */}
        <div className="bg-linear-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-md border border-purple-500/40 rounded-2xl p-6">
          <h3 className="text-gray-400 tracking-wider">Palcos</h3>
          <p className="text-3xl font-bold mt-3">{store.stages.length}</p>
        </div>
      </div>

      {/* ==============================
      🌈 FESTIVAL REVENUE CHART
================================ */}
      <div className="mt-10 relative">
        {/* Glow background */}
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 via-pink-500/10 to-purple-600/10 blur-3xl opacity-40" />

        <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_80px_rgba(168,85,247,0.15)]">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-wide">
                Receita por Tipo
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Performance financeira por categoria de ingresso
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-purple-400">
                R$ {simulatedRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueChartData} barCategoryGap="10%">
              <defs>
                <linearGradient
                  id="festivalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#2a2a2a"
                strokeDasharray="3 6"
                vertical={false}
              />

              <XAxis dataKey="name" stroke="#999" tick={{ fontSize: 12 }} />

              <YAxis
                stroke="#999"
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />

              <Tooltip
                cursor={{ fill: 'rgba(168,85,247,0.08)' }}
                contentStyle={{
                  backgroundColor: '#0f0f0f',
                  border: '1px solid #a855f7',
                  borderRadius: '16px',
                  boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                }}
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return `R$ ${value.toLocaleString('pt-BR')}`
                  }
                  return value
                }}
              />

              <Bar
                dataKey="revenue"
                fill="url(#festivalGradient)"
                radius={[20, 20, 0, 0]}
                animationDuration={1200}
                barSize={790}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TIPOS + FASES */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {liveTypes.map((type) => {
          const typeRevenue = type.phases.reduce(
            (acc, phase) => acc + phase.price * phase.sold,
            0,
          )

          return (
            <div
              key={type.id}
              className="bg-zinc-900 border border-purple-400/40 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{type.name}</h3>

                <span className="text-purple-300 font-semibold">
                  R$ {typeRevenue.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="space-y-6">
                {type.phases.map((phase) => {
                  const revenue = phase.price * phase.sold
                  const progress = (phase.sold / phase.limit) * 100

                  return (
                    <div key={phase.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-300">{phase.name}</p>
                          <p className="text-xs text-gray-500">
                            R$ {phase.price.toLocaleString('pt-BR')}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${getStatusBadge(
                            phase.status,
                          )}`}
                        >
                          {phase.status === 'active' && 'Ativo'}
                          {phase.status === 'almost' && 'Quase Esgotado'}
                          {phase.status === 'soldout' && 'Esgotado'}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>
                            {phase.sold.toLocaleString('pt-BR')} /{' '}
                            {phase.limit.toLocaleString('pt-BR')} vendidos
                          </span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>

                        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />

                          {phase.status === 'almost' && (
                            <div className="absolute inset-0 bg-orange-400/10 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-400">
                        Receita: R$ {revenue.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
