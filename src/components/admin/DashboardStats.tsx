import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { store } from '../../modules/admin/store/adminStore'

export default function DashboardStats() {
  // ==============================
  // 📈 SIMULAÇÃO VENDAS AO VIVO
  // ==============================

  const [liveSalesData, setLiveSalesData] = useState<
    { time: string; vendas: number }[]
  >([])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSalesData((prev) => {
        const now = new Date()
        const timeLabel = now.toLocaleTimeString('pt-BR', {
          minute: '2-digit',
          second: '2-digit',
        })

        const newPoint = {
          time: timeLabel,
          vendas: Math.floor(Math.random() * 120) + 20,
        }

        const updated = [...prev, newPoint]

        // mantém apenas últimos 25 pontos
        if (updated.length > 25) updated.shift()

        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const ticketTypes = store.ticketTypes || []

  // ==============================
  // 🎟 TOTAIS GERAIS
  // ==============================

  const totalRevenue = ticketTypes.reduce(
    (acc, type) =>
      acc +
      type.phases.reduce((sum, phase) => sum + phase.sold * phase.price, 0),
    0,
  )

  // ==============================
  // 🎟 RECEITA POR TIPO
  // ==============================

  // ==============================
  // 🎤 RECEITA POR DIA (MODELO PROFISSIONAL)
  // ==============================

  const festivalDays = [28, 29, 30]

  // Contagem real de shows
  const showsCountByDay = festivalDays.map((day) => ({
    day,
    shows: store.performances.filter((p) => Number(p.day) === day).length,
  }))

  // Receita por tipo
  const revenueByType = ticketTypes.map((type) => ({
    name: type.name,
    receita: type.phases.reduce(
      (acc, phase) => acc + phase.sold * phase.price,
      0,
    ),
  }))

  // Separando Passaporte
  const passaporteRevenue =
    revenueByType.find((t) => t.name === 'Passaporte 3 Dias')?.receita || 0

  const singleDayRevenue = revenueByType
    .filter((t) => t.name !== 'Passaporte 3 Dias')
    .reduce((acc, t) => acc + t.receita, 0)

  // Peso estratégico por dia (mercado real)
  const dayWeights: Record<number, number> = {
    28: 0.33, // Sexta forte
    29: 0.42, // Sábado pico
    30: 0.27, // Domingo queda natural
  }

  const revenueByDay = festivalDays.map((day) => {
    const showsInDay = showsCountByDay.find((d) => d.day === day)?.shows || 0

    const revenueSingleDay = singleDayRevenue * dayWeights[day]

    const revenuePassaporte = passaporteRevenue / 3

    return {
      day: `Dia ${day}`,
      receita: Math.round(revenueSingleDay + revenuePassaporte),
      shows: showsInDay,
    }
  })

  // ==============================
  // 📈 EVOLUÇÃO ESTRATÉGICA
  // ==============================

  const revenueEvolution = [
    { etapa: 'Lançamento', receita: Math.round(totalRevenue * 0.2) },
    { etapa: 'Pré-venda', receita: Math.round(totalRevenue * 0.38) },
    { etapa: '1º Lote', receita: Math.round(totalRevenue * 0.55) },
    { etapa: '2º Lote', receita: Math.round(totalRevenue * 0.72) },
    { etapa: 'Atual', receita: totalRevenue },
  ]

  return (
    <section className="w-full bg-zinc-950 py-20 text-white">
      <div className="max-full mx-auto px-16">
        {/* HEADER */}
        <div className="text-start mb-12">
          <h2 className="text-4xl md:text-5xl font-bold neon-text">
            Festival Analytics
          </h2>
          <p className="text-gray-400 mt-4">
            Visão estratégica consolidada do evento
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* 🎟 RECEITA POR TIPO */}
          {/* 📈 VENDAS AO VIVO */}
          <div className="bg-zinc-900 border border-purple-500/20 rounded-3xl p-4">
            <h3 className="text-xl font-bold mb-8 text-purple-400">
              Vendas em Tempo Real
            </h3>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={liveSalesData}>
                <CartesianGrid stroke="#222" vertical={false} />

                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 11 }} />

                <YAxis stroke="#888" tickFormatter={(v) => `${v}`} />

                <Tooltip
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return `${value} ingressos`
                    }
                    return value
                  }}
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #a855f7',
                    borderRadius: '12px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🎤 RECEITA POR DIA */}
          <div className="bg-zinc-900 border border-pink-500/20 rounded-3xl p-4">
            <h3 className="text-xl font-bold mb-8 text-pink-400">
              Receita por Dia
            </h3>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByDay}>
                <CartesianGrid stroke="#222" vertical={false} />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis
                  stroke="#888"
                  tickFormatter={(v) => `R$ ${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return `R$ ${value.toLocaleString('pt-BR')}`
                    }
                    return value
                  }}
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #ec4899',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="receita" fill="#ec4899" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 📈 EVOLUÇÃO DE RECEITA */}
          <div className="md:col-span-2 bg-zinc-900 border border-purple-500/20 rounded-3xl p-4">
            <h3 className="text-xl font-bold mb-8 text-purple-400">
              Evolução de Receita
            </h3>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueEvolution}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#222" vertical={false} />
                <XAxis dataKey="etapa" stroke="#888" />
                <YAxis
                  stroke="#888"
                  tickFormatter={(v) => `R$ ${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return `R$ ${value.toLocaleString('pt-BR')}`
                    }
                    return value
                  }}
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #a855f7',
                    borderRadius: '12px',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
