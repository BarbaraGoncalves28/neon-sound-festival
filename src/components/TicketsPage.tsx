import { useEffect, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";

/* =========================
TYPES
========================= */
type FormErrors = {
  name?: string
  email?: string
  cpf?: string
  phone?: string
  payment?: string
}

type Batch = {
  name: string;
  price: number;
  remaining: number;
};

type TicketType = {
  id: string;
  name: string;
  batches: Batch[];
};

/* =========================
MOCK DATA
========================= */

const ticketTypes: TicketType[] = [
  {
    id: "pista",
    name: "Pista",
    batches: [
      { name: "Lote 2", price: 750, remaining: 112000 },
      { name: "Lote 2", price: 750, remaining: 112000 },
      { name: "Lote 2", price: 750, remaining: 112000 },
    ],
  },
  {
    id: "vip",
    name: "VIP",
    batches: [
      { name: "Lote 1", price: 1200, remaining: 42000 },
      { name: "Lote 1", price: 1200, remaining: 42000 },
      { name: "Lote 1", price: 1200, remaining: 42000 },
    ],
  },
  {
    id: "backstage",
    name: "Backstage",
    batches: [
      { name: "Lote 1", price: 2500, remaining: 8400 },
      { name: "Lote 1", price: 2500, remaining: 8400 },
    ],
  },
  {
    id: "meiaentrada",
    name: "Meia-entrada",
    batches: [
      { name: "Lote 2", price: 325, remaining: 84000 },
      { name: "Lote 2", price: 325, remaining: 84000 },
    ],
  },
  {
    id: "passaporte",
    name: "Passaporte 3 dias",
    batches: [
      { name: "Lote 1", price: 1650, remaining: 33600 },
      { name: "Lote 1", price: 1650, remaining: 33600 },
    ],
  },
];

const formatNumberTickets = (value: number) =>
  value.toLocaleString("pt-BR");

const formatPriceTickets = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const days = [28, 29, 30];

/* =========================
COMPONENT
========================= */

export function TicketsPage() {
  const [ticketTypesState, setTicketTypesState] = useState<TicketType[]>(ticketTypes);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerCPF, setBuyerCPF] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<
    "pix" | "credito" | "debito" | null
  >(null);

  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const activeBatch =
    selectedTicket?.batches.find((b) => b.remaining > 0) ?? null;

    // UseEffect regressiva tickets restantes

    useEffect(() => {
  let timeout: ReturnType<typeof setTimeout>;
  let fastMode = true;

  const updateTickets = () => {
    setTicketTypesState((prev) => {
      return prev.map((ticket) => {

        let sellAmount = fastMode
          ? Math.floor(Math.random() * 20) + 8   // vendas rápidas
          : Math.floor(Math.random() * 4);       // vendas lentas

        const updatedBatches = ticket.batches.map((batch) => {
          if (sellAmount <= 0 || batch.remaining <= 0) return batch;

          const sold = Math.min(sellAmount, batch.remaining);
          sellAmount -= sold;

          return {
            ...batch,
            remaining: batch.remaining - sold,
          };
        });

        return {
          ...ticket,
          batches: updatedBatches,
        };
      });
    });

    // alterna entre rápido e lento
    fastMode = !fastMode;

    const nextDelay = fastMode
      ? Math.random() * 400 + 120   // rápido
      : Math.random() * 1800 + 800; // lento

    timeout = setTimeout(updateTickets, nextDelay);
  };

  updateTickets();

  return () => clearTimeout(timeout);
}, []);

  /* =========================
  PAYMENT
  ========================= */

  async function handlePayment() {
    setLoadingPayment(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const token = crypto.randomUUID();

    const payload = {
      token,
      name: buyerName,
      email: buyerEmail,
      ticketType: selectedTicket?.name,
      day: selectedDay,
      paymentMethod,
    };

    const qr = await QRCode.toDataURL(JSON.stringify(payload));

    setQrCode(qr);

    console.log("📧 Email enviado para:", buyerEmail, payload);

    setLoadingPayment(false);
    setStep(5);

    const newTicket = {
  id: token.slice(0, 8),
  type: selectedTicket?.name,
  day: selectedDay,
  qr: qr,
  ownerEmail: buyerEmail,
};

const existing = JSON.parse(localStorage.getItem("tickets") || "[]");

localStorage.setItem(
  "tickets",
  JSON.stringify([...existing, newTicket])
);
  }

//   VALIDAÇÃO FORMULÁRIO
function validateForm() {
  const newErrors: {
    name?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    payment?: string;
  } = {};

  // NOME
  if (!buyerName.trim() || buyerName.trim().split(" ").length < 2) {
    newErrors.name = "Digite seu nome completo";
  }

  // EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(buyerEmail)) {
    newErrors.email = "Email inválido";
  }

  // CPF (apenas números)
  const cpfNumbers = buyerCPF.replace(/\D/g, "");
  if (cpfNumbers.length !== 11 || /^(\d)\1+$/.test(cpfNumbers)) {
    newErrors.cpf = "CPF inválido";
  }

  // TELEFONE (DDD + número)
  const phoneNumbers = buyerPhone.replace(/\D/g, "");
  if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
    newErrors.phone = "Telefone inválido (DDD + número)";
  }

  // PAGAMENTO
  if (!paymentMethod) {
    newErrors.payment = "Escolha um método de pagamento";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 2) {
    return `(${numbers}`;
  }

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

  /* =========================
  PDF
  ========================= */

  function downloadTicket() {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const ticketId = crypto.randomUUID().slice(0, 8).toUpperCase();

  const purchaseDate = new Date();

  const formattedPurchaseDate = purchaseDate.toLocaleDateString("pt-BR");

  const formattedPurchaseTime = purchaseDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* HEADER */
  pdf.setFillColor(192, 132, 252); // lilás
  pdf.rect(0, 0, 210, 40, "F");

  /* TITULO */
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26);
  pdf.text("NEON SOUND FESTIVAL", 105, 20, { align: "center" });

  pdf.setFontSize(12);
  pdf.text("Festival de Música", 105, 30, { align: "center" });

  /* VOLTA COR TEXTO */
  pdf.setTextColor(0, 0, 0);

  /* BOX DO INGRESSO */
  pdf.setDrawColor(200);
  pdf.roundedRect(20, 50, 170, 100, 5, 5);

  pdf.setFontSize(16);
  pdf.text("INGRESSO OFICIAL", 105, 60, { align: "center" });

  pdf.setFontSize(12);

  pdf.text(`Nome: ${buyerName}`, 30, 80);
  pdf.text(`Email: ${buyerEmail}`, 30, 90);
  pdf.text(`Tipo de ingresso: ${selectedTicket?.name}`, 30, 100);
  pdf.text(`Dia do evento: ${selectedDay} de Junho`, 30, 110);
  pdf.text(`Pagamento: ${paymentMethod}`, 30, 120);

  pdf.text(`Ticket ID: ${ticketId}`, 30, 130);

  pdf.text(`Data da compra: ${formattedPurchaseDate}`, 30, 140);
  pdf.text(`Hora da compra: ${formattedPurchaseTime}`, 30, 148);

  /* QR CODE */
  if (qrCode) {
    pdf.addImage(qrCode, "PNG", 135, 80, 40, 40);
  }

  /* LINHA SEPARADORA */
  pdf.setDrawColor(180);
  pdf.line(20, 160, 190, 160);

  /* INFO EVENTO */
  pdf.setFontSize(12);
  pdf.text("Local: Autódromo de Interlagos, Av. Senador Lago Branco, 251 Interlagos – São Paulo/SP ", 30, 175);
  pdf.text("Data: 28 • 29 • 30 Junho 2027", 30, 185);
  pdf.text("Apresente este QR Code na entrada.", 30, 195);

  /* RODAPÉ */
  pdf.setFontSize(10);
  pdf.setTextColor(120);
  pdf.text(
    "Este ingresso é único e intransferível. A duplicação invalidará o acesso.",
    105,
    210,
    { align: "center" }
  );

  pdf.save("neon-ticket.pdf");
}

  return (
    <div className="bg-black text-white min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20 mt-20">
  <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
      Tickets
  </h2>
  <p className="text-gray-400 mt-4 max-w-xl mx-auto">
    Garanta seu lugar no Neon Sound Festival 2027
  </p>
</div>


        {/* PROGRESS */}

        <div className="flex justify-center mb-12 gap-10 text-sm">

          <div className={step >= 1 ? "neon-text font-medium" : "text-gray-400"}>
            1 • Ingresso
          </div>

          <div className={step >= 2 ? "neon-text font-bold" : "text-gray-400"}>
            2 • Dia
          </div>

          <div className={step >= 3 ? "neon-text font-bold" : "text-gray-400"}>
            3 • Revisão
          </div>

          <div className={step >= 4 ? "neon-text font-bold" : "text-gray-400"}>
            4 • Dados
          </div>

          <div className={step >= 5 ? "neon-text font-bold" : "text-gray-400"}>
            5 • Confirmação
          </div>

        </div>

        {/* STEP 1 */}

        {step === 1 && (

<div>

<h2 className="text-sm md:text-3xl font-bold text-center neon-text mb-10">
      Escolha seu Ingresso
  </h2>

<div className="grid md:grid-cols-3 gap-10">

{ticketTypesState.map((ticket) => {

const batch = ticket.batches.find((b) => b.remaining > 0);

return (

<div
key={ticket.id}
className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-3xl cursor-pointer hover:border-purple-500 hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-2"
onClick={() => {
setSelectedTicket(ticket);
setStep(2);
}}
>

{batch && (
<div className="absolute top-4 right-4 text-xs bg-purple-500 px-3 py-1 rounded-full font-bold">
{batch.name}
</div>
)}

<h3 className="neon-text text-2xl font-bold mb-4">
{ticket.name}
</h3>

{batch && (
<>
<p className="text-3xl font-bold mb-2 neon-text">
{formatPriceTickets(batch.price)}
</p>

<p className="text-sm text-gray-400 mb-6">
⚡ {formatNumberTickets(batch.remaining)} ingressos restantes
</p>

<div className="w-full bg-pink-500/20 h-2 rounded-full overflow-hidden">

<div
className="bg-purple-500 h-full"
style={{
width: `${Math.min(100, 100 - batch.remaining / 10)}%`,
}}
/>

</div>
</>
)}

</div>

);

})}

</div>

</div>

)}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="text-center">

            <h2 className="text-sm md:text-3xl font-bold text-center neon-text mb-10">
      Escolha o Dia do Festival
  </h2>

            <div className="flex justify-center gap-6">

              {days.map((day) => (
                <button
                  key={day}
                  className={`font-medium px-8 py-4 rounded-xl border ${
                    selectedDay === day
                      ? "bg-purple-700 border-purple-700"
                      : "cursor-pointer border-purple-700 hover:bg-purple-700 neon-hover"
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  Dia {day}
                </button>
              ))}

            </div>

            {selectedDay && (
              <button
                className="mt-20 neon-button px-8 py-4 rounded-full font-bold
                 text-center hover:bg-purple-600 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] transition cursor-pointer neon-text neon-button duration-300"
                onClick={() => setStep(3)}
              >
                Continuar
              </button>
            )}

          </div>
        )}

        {/* STEP 3 REVIEW */}

        {step === 3 && activeBatch && (
          <div className="max-w-lg mx-auto">

            <h2 className="text-sm md:text-3xl font-bold text-center neon-text mb-10">
      Revisar Compra
  </h2>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-4">

              <div className="flex justify-between">
                <span>Ingresso</span>
                <b>{selectedTicket?.name}</b>
              </div>

              <div className="flex justify-between">
                <span>Dia</span>
                <b>{selectedDay}</b>
              </div>

              <div className="flex justify-between">
                <span>Lote</span>
                <b>{activeBatch.name}</b>
              </div>

              <div className="flex justify-between text-xl font-bold border-t border-zinc-800 pt-4">
                <span>Total</span>
                <span>{formatPriceTickets(activeBatch.price)}</span>
              </div>

            </div>

            <button
              className="block mx-auto cursor-pointer mt-20 neon-button transition-all duration-300 px-6 py-4 rounded-full text-center hover:bg-purple-600 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] neon-text neon-button  font-bold
              "
              onClick={() => setStep(4)}
            >
              Efetuar pagamento
            </button>

          </div>
        )}

        {/* STEP 4 FORM */}

        {step === 4 && (
          <div className="max-w-xl mx-auto">

            <h2 className="text-sm md:text-3xl font-bold text-center neon-text mb-10">
      Dados do Comprador
  </h2>

            <div className="space-y-4">

              <input
placeholder="Nome completo"
className="w-full p-3 bg-black border border-zinc-700 rounded focus:border-purple-700 focus:outline-none"
value={buyerName}
onChange={(e) => setBuyerName(e.target.value)}
/>

{errors.name && (
<p className="text-red-500 text-sm">{errors.name}</p>
)}

              <input
placeholder="Email"
className="w-full p-3 bg-black border border-zinc-700 rounded focus:border-purple-700 focus:outline-none"
value={buyerEmail}
onChange={(e) => setBuyerEmail(e.target.value)}
/>

{errors.email && (
<p className="text-red-500 text-sm">{errors.email}</p>
)}

              <input
placeholder="CPF"
className="w-full p-3 bg-black border border-zinc-700 rounded focus:border-purple-700 focus:outline-none"
value={buyerCPF}
onChange={(e) => setBuyerCPF(e.target.value)}
/>

{errors.cpf && (
<p className="text-red-500 text-sm">{errors.cpf}</p>
)}

              <input
  placeholder="Telefone"
  className="w-full p-3 bg-black border border-zinc-700 rounded focus:border-purple-700 focus:outline-none"
  value={buyerPhone}
  onChange={(e) => {
    setBuyerPhone(formatPhone(e.target.value));
  }}
/>

{errors.phone && (
<p className="text-red-500 text-sm">{errors.phone}</p>
)}

              {/* PAYMENT */}

              <div className="grid grid-cols-3 gap-4 pt-4">

                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`cursor-pointer font-medium p-4 border rounded-xl ${
                    paymentMethod === "pix"
                      ? "border-purple-500"
                      : "border-purple-700 hover:bg-purple-700 neon-hover"
                  }`}
                >
                  💠 PIX
                </button>

                <button
                  onClick={() => setPaymentMethod("credito")}
                  className={`cursor-pointer font-medium p-4 border rounded-xl ${
                    paymentMethod === "credito"
                      ? "border-purple-500"
                      : "border-purple-700 hover:bg-purple-700 neon-hover"
                  }`}
                >
                  💳 Crédito
                </button>

                <button
                  onClick={() => setPaymentMethod("debito")}
                  className={`cursor-pointer font-medium p-4 border rounded-xl ${
                    paymentMethod === "debito"
                      ? "border-purple-500"
                      : "border-purple-700 hover:bg-purple-700 neon-hover"
                  }`}
                >
                  🏦 Débito
                </button>

                

              </div>

              {errors.payment && (
<p className="text-red-500 text-sm mt-2">
{errors.payment}
</p>
)}

            </div>

            <button
              className="w-full cursor-pointer mt-20 neon-button transition-all duration-300 py-4 rounded-full font-bold flex justify-center gap-3 text-center hover:bg-purple-600 px-4 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] neon-text neon-button
              "
              onClick={() => {
  if (!validateForm()) return;
  handlePayment();
}} disabled={loadingPayment}
            >

              {loadingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando pagamento...
                </>
              ) : (
                "Comprar"
              )}

            </button>

          </div>
        )}

        {/* STEP 5 CONFIRMATION */}

        {step === 5 && qrCode && (
          <div className="text-center">

            <h2 className="text-sm md:text-3xl font-bold text-center neon-text mb-10">
      Ingresso Confirmado
  </h2>

            <div className="bg-zinc-900 border border-purple-500 rounded-3xl p-10 max-w-md mx-auto">

              <h3 className="text-xl font-bold mb-2 neon-text">
                Neon Sound Festival
              </h3>

              <p className="text-gray-400 mb-6">
                Dia {selectedDay} • {selectedTicket?.name}
              </p>

              <img
                src={qrCode}
                className="mx-auto w-56 bg-white p-4 rounded-xl"
              />

              <p className="mt-6 text-sm text-gray-400">
                Apresente este QR Code na entrada.
              </p>

              <p className="mt-4 neon-text text-sm font-medium">
                Ingresso enviado para <br/> {buyerEmail}
              </p>

              <button
                onClick={downloadTicket}
                className="cursor-pointer mt-15 neon-button transition-all duration-300 px-6 py-3 rounded-full font-bold text-center hover:bg-purple-600 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] neon-text neon-button
                "
              >
                Baixar ingresso em PDF
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}