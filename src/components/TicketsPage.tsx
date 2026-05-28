import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  festivalDays,
  getActiveBatch,
  ticketCatalog,
  type TicketCategory,
} from '../data/festivalData'
import { useAuth } from '../hooks/useAuth'

type PaymentMethod = 'pix' | 'credito' | 'debito'

type FormErrors = {
  name?: string
  email?: string
  cpf?: string
  phone?: string
  payment?: string
}

type StoredTicket = {
  id: string
  type: string
  day: number
  qr: string
  ownerEmail: string
}

const checkoutSteps = ['Ingresso', 'Dia', 'Revisão', 'Dados', 'Confirmação']

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatNumber = (value: number) => value.toLocaleString('pt-BR')

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)

  if (numbers.length <= 2) return `(${numbers}`
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

export function TicketsPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const requestedTicketId = searchParams.get('ticket')
  const hasRequestedTicket = Boolean(
    requestedTicketId &&
    ticketCatalog.some((ticket) => ticket.id === requestedTicketId),
  )
  const [ticketInventory, setTicketInventory] = useState<TicketCategory[]>(() =>
    structuredClone(ticketCatalog),
  )
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    hasRequestedTicket ? requestedTicketId : null,
  )
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [step, setStep] = useState(hasRequestedTicket ? 2 : 1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [buyerName, setBuyerName] = useState(() => user?.name ?? '')
  const [buyerEmail, setBuyerEmail] = useState(() => user?.email ?? '')
  const [buyerCPF, setBuyerCPF] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [generatedTicket, setGeneratedTicket] = useState<StoredTicket | null>(
    null,
  )

  const selectedTicket = useMemo(
    () =>
      ticketInventory.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, ticketInventory],
  )

  const activeBatch = selectedTicket ? getActiveBatch(selectedTicket) : null

  function validateForm() {
    const nextErrors: FormErrors = {}

    if (buyerName.trim().split(' ').filter(Boolean).length < 2) {
      nextErrors.name = 'Informe nome e sobrenome.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    const cpf = buyerCPF.replace(/\D/g, '')
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      nextErrors.cpf = 'Informe um CPF válido.'
    }

    const phone = buyerPhone.replace(/\D/g, '')
    if (phone.length < 10 || phone.length > 11) {
      nextErrors.phone = 'Informe telefone com DDD.'
    }

    if (!paymentMethod) {
      nextErrors.payment = 'Selecione um método de pagamento.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handlePayment() {
    if (!selectedTicket || !selectedDay || !activeBatch || !paymentMethod) {
      return
    }

    setLoadingPayment(true)

    await new Promise((resolve) => window.setTimeout(resolve, 1800))

    const token = crypto.randomUUID()
    const payload = {
      token,
      name: buyerName,
      email: buyerEmail,
      ticketType: selectedTicket.name,
      day: selectedDay,
      paymentMethod,
    }

    const qr = await QRCode.toDataURL(JSON.stringify(payload))
    const ticket: StoredTicket = {
      id: token.slice(0, 8).toUpperCase(),
      type: selectedTicket.name,
      day: selectedDay,
      qr,
      ownerEmail: buyerEmail,
    }

    const existingTickets = JSON.parse(
      localStorage.getItem('tickets') || '[]',
    ) as StoredTicket[]
    localStorage.setItem(
      'tickets',
      JSON.stringify([...existingTickets, ticket]),
    )

    setTicketInventory((current) =>
      current.map((ticketItem) => {
        if (ticketItem.id !== selectedTicket.id) {
          return ticketItem
        }

        return {
          ...ticketItem,
          batches: ticketItem.batches.map((batch, index) => {
            if (index !== 0 || batch.remaining <= 0) {
              return batch
            }

            return { ...batch, remaining: batch.remaining - 1 }
          }),
        }
      }),
    )

    setGeneratedTicket(ticket)
    setQrCode(qr)
    setLoadingPayment(false)
    setStep(5)
  }

  function downloadTicket() {
    if (!generatedTicket || !selectedTicket || !selectedDay) {
      return
    }

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const purchaseDate = new Date()

    pdf.setFillColor(147, 51, 234)
    pdf.rect(0, 0, 210, 40, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(26)
    pdf.text('NEON SOUND FESTIVAL', 105, 20, { align: 'center' })
    pdf.setFontSize(12)
    pdf.text('Ingresso oficial • Festival multi-palco', 105, 30, {
      align: 'center',
    })

    pdf.setTextColor(30, 30, 30)
    pdf.setDrawColor(220)
    pdf.roundedRect(18, 50, 174, 115, 5, 5)
    pdf.setFontSize(14)
    pdf.text(`Participante: ${buyerName}`, 28, 72)
    pdf.text(`E-mail: ${buyerEmail}`, 28, 84)
    pdf.text(`Ingresso: ${selectedTicket.name}`, 28, 96)
    pdf.text(`Dia: ${selectedDay} de junho de 2027`, 28, 108)
    pdf.text(`Ticket ID: ${generatedTicket.id}`, 28, 120)
    pdf.text(
      `Compra: ${purchaseDate.toLocaleDateString('pt-BR')} às ${purchaseDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      28,
      132,
    )

    if (qrCode) {
      pdf.addImage(qrCode, 'PNG', 138, 72, 36, 36)
    }

    pdf.line(18, 172, 192, 172)
    pdf.setFontSize(11)
    pdf.text('Local: Autódromo de Interlagos • São Paulo/SP', 28, 184)
    pdf.text('Apresente este QR Code na entrada para validação.', 28, 194)
    pdf.text('Ingresso único e intransferível.', 105, 208, { align: 'center' })

    pdf.save(`neon-ticket-${generatedTicket.id}.pdf`)
  }

  return (
    <div className="min-h-screen bg-black px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-purple-300">
            Checkout seguro
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Garanta seu lugar no Neon Sound Festival
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            Fluxo de compra em etapas com feedback claro, formulários acessíveis
            e prioridade para uso confortável em mobile.
          </p>
        </header>

        <ol className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {checkoutSteps.map((stepLabel, index) => {
            const currentStep = index + 1
            const isActive = step >= currentStep

            return (
              <li
                key={stepLabel}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${
                  isActive
                    ? 'border-purple-400/40 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/45'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.3em] text-purple-200">
                  0{currentStep}
                </span>
                <p className="mt-2 font-medium">{stepLabel}</p>
              </li>
            )
          })}
        </ol>

        {step === 1 && (
          <section>
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Escolha seu ingresso
              </h2>
              <p className="mt-2 text-white/65">
                Cards clicáveis foram substituídos por botões semânticos com
                conteúdo mais claro e responsivo.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {ticketInventory.map((ticket) => {
                const batch = getActiveBatch(ticket)

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => {
                      setSelectedTicketId(ticket.id)
                      setStep(2)
                    }}
                    className="flex h-full flex-col rounded-4xl border border-white/10 bg-zinc-950/80 p-6 text-left shadow-[0_0_40px_rgba(168,85,247,0.08)] transition hover:-translate-y-1 hover:border-purple-400/40"
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

                    {batch && (
                      <>
                        <p className="mt-8 text-sm text-white/50">
                          {batch.name}
                        </p>
                        <p className="mt-2 text-3xl font-black">
                          {formatCurrency(batch.price)}
                        </p>
                        <p className="mt-2 text-sm text-purple-200">
                          {formatNumber(batch.remaining)} ingressos disponíveis
                        </p>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-4xl border border-white/10 bg-zinc-950/75 p-6 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Escolha o dia do festival
            </h2>
            <p className="mt-2 text-white/65">
              Selecione a data que melhor encaixa na sua jornada.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {festivalDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-2xl border px-5 py-5 text-left transition ${
                    selectedDay === day
                      ? 'border-purple-400 bg-purple-500/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-purple-400/40 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-purple-200">
                    Dia
                  </span>
                  <p className="mt-2 text-2xl font-bold">{day}</p>
                  <p className="mt-1 text-sm text-white/55">Junho de 2027</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!selectedDay}
                onClick={() => setStep(3)}
                className="neon-button rounded-full px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuar para revisão
              </button>
            </div>
          </section>
        )}

        {step === 3 && selectedTicket && activeBatch && selectedDay && (
          <section className="mx-auto max-w-2xl rounded-4xl border border-white/10 bg-zinc-950/75 p-6 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Revise sua compra
            </h2>
            <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/65">Ingresso</span>
                <strong>{selectedTicket.name}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/65">Dia</span>
                <strong>{selectedDay} de junho</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/65">Lote atual</span>
                <strong>{activeBatch.name}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(activeBatch.price)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10"
              >
                Alterar dia
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="neon-button rounded-full px-5 py-3 text-sm font-bold text-white"
              >
                Continuar para pagamento
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto max-w-3xl rounded-4xl border border-white/10 bg-zinc-950/75 p-6 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Dados do comprador
            </h2>
            <p className="mt-2 text-white/65">
              Formulário revisado com labels, validação clara e layout
              consistente em qualquer breakpoint.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="buyer-name"
                  className="mb-2 block text-sm font-medium text-white/85"
                >
                  Nome completo
                </label>
                <input
                  id="buyer-name"
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white focus:border-purple-400 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-pink-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="buyer-email"
                  className="mb-2 block text-sm font-medium text-white/85"
                >
                  E-mail
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white focus:border-purple-400 focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-pink-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="buyer-cpf"
                  className="mb-2 block text-sm font-medium text-white/85"
                >
                  CPF
                </label>
                <input
                  id="buyer-cpf"
                  inputMode="numeric"
                  value={buyerCPF}
                  onChange={(event) =>
                    setBuyerCPF(
                      event.target.value.replace(/\D/g, '').slice(0, 11),
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white focus:border-purple-400 focus:outline-none"
                />
                {errors.cpf && (
                  <p className="mt-2 text-sm text-pink-400">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="buyer-phone"
                  className="mb-2 block text-sm font-medium text-white/85"
                >
                  Telefone
                </label>
                <input
                  id="buyer-phone"
                  inputMode="tel"
                  value={buyerPhone}
                  onChange={(event) =>
                    setBuyerPhone(formatPhone(event.target.value))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white focus:border-purple-400 focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-pink-400">{errors.phone}</p>
                )}
              </div>
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-white/85">
                Forma de pagamento
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { id: 'pix', label: 'PIX', icon: '💠' },
                  { id: 'credito', label: 'Crédito', icon: '💳' },
                  { id: 'debito', label: 'Débito', icon: '🏦' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      paymentMethod === option.id
                        ? 'border-purple-400 bg-purple-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-purple-400/30 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <p className="mt-3 font-semibold">{option.label}</p>
                  </button>
                ))}
              </div>
              {errors.payment && (
                <p className="mt-2 text-sm text-pink-400">{errors.payment}</p>
              )}
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10"
              >
                Voltar para revisão
              </button>
              <button
                type="button"
                disabled={loadingPayment}
                aria-busy={loadingPayment}
                onClick={() => {
                  if (!validateForm()) return
                  handlePayment()
                }}
                className="neon-button inline-flex items-center justify-center gap-3 rounded-full px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingPayment ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processando pagamento...
                  </>
                ) : (
                  'Confirmar compra'
                )}
              </button>
            </div>
          </section>
        )}

        {step === 5 &&
          qrCode &&
          generatedTicket &&
          selectedTicket &&
          selectedDay && (
            <section className="mx-auto max-w-xl rounded-4xl border border-purple-400/30 bg-zinc-950/80 p-6 text-center shadow-[0_0_50px_rgba(168,85,247,0.12)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-purple-300">
                Compra concluída
              </p>
              <h2 className="mt-4 text-3xl font-bold">Ingresso confirmado</h2>
              <p className="mt-3 text-white/65">
                Dia {selectedDay} • {selectedTicket.name}
              </p>

              <img
                src={qrCode}
                alt="QR Code do ingresso"
                className="mx-auto mt-8 w-56 rounded-3xl bg-white p-4"
              />

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5 text-left">
                <p className="text-sm text-white/60">Ticket ID</p>
                <p className="mt-1 text-lg font-semibold text-purple-200">
                  {generatedTicket.id}
                </p>
                <p className="mt-4 text-sm text-white/60">Enviado para</p>
                <p className="mt-1 font-medium">{buyerEmail}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={downloadTicket}
                  className="neon-button rounded-full px-5 py-3 text-sm font-bold text-white"
                >
                  Baixar PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTicketId(null)
                    setSelectedDay(null)
                    setPaymentMethod(null)
                    setErrors({})
                    setBuyerCPF('')
                    setBuyerPhone('')
                    setGeneratedTicket(null)
                    setQrCode(null)
                    setStep(1)
                  }}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10"
                >
                  Comprar outro ingresso
                </button>
              </div>
            </section>
          )}
      </div>
    </div>
  )
}

export default TicketsPage
