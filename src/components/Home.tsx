import { useEffect, useState } from "react";
import home from "../assets/images/home.png";
import singerpopone from "../assets/images/singer-pop-one.png";
import singerrapone from "../assets/images/singer-rap-one.png";
import singerraptwo from "../assets/images/singer-rap-two.png";
import singerrapthree from "../assets/images/singer-rap-three.png";
import singerrapfour from "../assets/images/singer-rap-four.png";
import singerrapfive from "../assets/images/singer-rap-five.png";
import singerrockone from "../assets/images/singer-rock-one.png"
import singerrocktwo from "../assets/images/singer-rock-two.png";
import singerrockthree from "../assets/images/singer-rock-three.png";
import singerrockfour from "../assets/images/singer-rock-four.png";
import singerrockfive from "../assets/images/singer-rock-five.png";
import singerpoptwo from "../assets/images/singer-pop-two.png";
import singerpopthree from "../assets/images/singer-pop-three.png";
import singerpopfour from "../assets/images/singer-pop-four.png";
import singerpopfive from "../assets/images/singer-pop-five.png";
import openingone from "../assets/images/opening-one.jpg";
import openingtwo from "../assets/images/opening-two.jpg";
import openingthree from "../assets/images/opening-three.jpg";
import { useNavigate } from "react-router-dom";

/* ===============================
   TYPES
=================================*/

type Headliner = {
  id: string;
  name: string;
  genre: string;
  day: number;
  image: string;
};

type Stage = {
  id: string;
  name: string;
  capacity: number;
  style: string;
};

type Ticket = {
  id: string;
  name: string;
  currentBatch: string;
  price: number;
  remaining: number;
};

/* ===============================
   MOCK DATA (Produção simulada)
=================================*/

const eventDate = new Date("2027-06-28T18:00:00");

const headliners: Headliner[] = [
  {
    id: "1",
    name: "Maya Skyline",
    genre: "Pop",
    day: 28,
    image: singerpopone,
  },
  {
    id: "2",
    name: "MC Eclipse",
    genre: "Rap/Hip-Hop",
    day: 30,
    image: singerrapone,
  },
  {
    id: "3",
    name: "Crimson Avenue",
    genre: "Rock",
    day: 28,
    image: singerrockone,
  },
  {
    id: "4",
    name: "Neon Aurora",
    genre: "Pop/Electronic",
    day: 30,
    image: singerpoptwo,
  },
  {
    id: "5",
    name: "Lex Phantom",
    genre: "Rap/Hip-Hop",
    day: 28,
    image: singerraptwo,
  },
  {
    id: "6",
    name: "Atlas Riff",
    genre: "Rock",
    day: 29,
    image: singerrocktwo,
  },
  {
    id: "7",
    name: "Kai Solaris",
    genre: "Pop",
    day: 28,
    image: singerpopthree,
  },
  {
    id: "8",
    name: "Razor Nova",
    genre: "Rap/Hip-Hop",
    day: 28,
    image: singerrapthree,
  },
  {
    id: "9",
    name: "Midnight Reactor",
    genre: "Rock",
    day: 29,
    image: singerrockthree,
  },
  {
    id: "10",
    name: "Velvet Bloom",
    genre: "Pop/Electronic",
    day: 30,
    image: singerpopfour,
  },
  {
    id: "11",
    name: "Zyro Blaze",
    genre: "Rap/Hip-Hop",
    day: 30,
    image: singerrapfour,
  },
  {
    id: "12",
    name: "Electric Dominion",
    genre: "Rock",
    day: 29,
    image: singerrockfour,
  },
  {
    id: "13",
    name: "J Luna",
    genre: "Pop",
    day: 29,
    image: singerpopfive,
  },
  {
    id: "14",
    name: "Krown Zero",
    genre: "Rap",
    day: 30,
    image: singerrapfive,
  },
  {
    id: "15",
    name: "Silver Howl",
    genre: "Rock",
    day: 29,
    image: singerrockfive,
  }, 
];

const openingArtists = [
  {
    id: 1,
    name: "The Weeknd",
    genre: "Dance-pop/R&B",
    day: 28,
    image: openingone,
  },
  {
    id: 2,
    name: "Ariana Grande",
    genre: "Pop R&B/Dance",
    day: 29,
    image: openingtwo,
  },
  {
    id: 3,
    name: "Dua Lipa",
    genre: "Dance/Electropop",
    day: 30,
    image: openingthree,
  }
];

const stages: Stage[] = [
  { id: "a", name: "Palco A", capacity: 100000, style: "Mainstream/Headliners" },
  { id: "b", name: "Palco B", capacity: 60000, style: "Rock/Indie" },
  { id: "c", name: "Palco Eletrônico", capacity: 40000, style: "EDM/Techno" },
  { id: "d", name: "Palco Alternativo", capacity: 20000, style: "Experimental/Novos Artistas" },
];

const initialTickets: Ticket[] = [
  { id: "1", name: "Pista", currentBatch: "Lote 2", price: 750, remaining: 112000 },
  { id: "2", name: "VIP", currentBatch: "Lote 1", price: 1200, remaining: 42000 },
  { id: "3", name: "Backstage", currentBatch: "Lote 1", price: 2500, remaining: 8400 },
  { id: "4", name: "Meia-entrada", currentBatch: "Lote 2", price: 325, remaining: 84000 },
  { id: "5", name: "Passaporte 3 dias", currentBatch: "Lote 1", price: 1650, remaining: 33600 },
];

const formatNumberTickets = (value: number) =>
  value.toLocaleString("pt-BR");

const formatPriceTickets = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

/* ===============================
   COMPONENT
=================================*/

export function Home() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(initialTickets);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = eventDate.getTime() - now;

    if (distance <= 0) {
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    setTimeLeft({ days, hours, minutes, seconds });
  }, 1000);

  return () => clearInterval(interval);
}, []);

const formatNumber = (num: number) => {
  return num.toString().padStart(2, "0");
}; 

const MAX_TICKETS = 280000;
const MAX_ARTISTS = 15;

const [stats, setStats] = useState({
  artists: 5,      // começa menor
  sold: 220552,     // começa menor
  stages: 4,
  days: 3,
});

useEffect(() => {
  let timeout: ReturnType<typeof setTimeout>;

  const updateSystem = () => {
    setStats((prevStats) => {
      if (prevStats.sold >= MAX_TICKETS) return prevStats;

      const randomIncrease = Math.floor(Math.random() * 120) + 10;

      const actualIncrease = Math.min(
        randomIncrease,
        MAX_TICKETS - prevStats.sold
      );

      // Atualiza tickets proporcionalmente
      setTickets((prevTickets) => {
        let remainingToRemove = actualIncrease;

        const updated = prevTickets.map((ticket) => {
          if (remainingToRemove <= 0 || ticket.remaining <= 0)
            return ticket;

          // venda aleatória por categoria
          const randomSell = Math.min(
            Math.floor(Math.random() * remainingToRemove),
            ticket.remaining
          );

          remainingToRemove -= randomSell;

          return {
            ...ticket,
            remaining: ticket.remaining - randomSell,
          };
        });

        return updated;
      });

      return {
        ...prevStats,
        sold: prevStats.sold + actualIncrease,
      };
    });

    const nextDelay = Math.random() * 2000 + 400;
    timeout = setTimeout(updateSystem, nextDelay);
  };

  updateSystem();

  return () => clearTimeout(timeout);
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    setStats((prev) => {
      if (prev.artists >= MAX_ARTISTS) return prev;

      return {
        ...prev,
        artists: prev.artists + 1,
      };
    });
  }, 60000); // 1 minuto

  return () => clearInterval(interval);
}, []);

  return (
    <div className="text-white bg-black">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(${home})`,
    }}
  ></div>

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-6">
          <h1 className="neon-text text-5xl md:text-7xl font-extrabold mb-6">
  Neon Sound Festival 2027
</h1>
          <p className="text-xl mb-2 font-medium">28, 29 e 30 de Junho de 2027</p>
          <p className="text-lg mb-6 font-medium">São Paulo - Brasil</p>

          <div className="flex gap-6 justify-center mb-10">

  {[
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ].map((item) => (
    <div
      key={item.label}
      className="flex flex-col items-center px-6 py-4 rounded-xl backdrop-blur-md bg-black/20 border border-purple-500/40 shadow-lg"
      style={{
        boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)",
      }}
    >
      <span className="text-5xl font-mono tracking-widest text-white">
        {formatNumber(item.value)}
      </span>
      <span className="text-xs uppercase tracking-wider text-purple-300 mt-2">
        {item.label}
      </span>
    </div>
  ))}

</div>

          <div className="flex gap-4 justify-center">
            <a
              href="/ingressos"
              className="neon-button transition-all duration-300 text-white py-3 
               hover:bg-purple-600 px-4 rounded-full border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] cursor-pointer neon-text font-bold"
            >
              Comprar Ingresso
            </a>
            <a
  href="/lineup"
  className="neon-outline-button"
>
  Ver Line-up
</a>
          </div>
        </div>
      </section>

      {/* HEADLINERS */}
<section className="py-24 px-6 max-w-7xl mx-auto">

<div className="text-center mb-20">
  <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
      Headliners
  </h2>
  <p className="text-gray-400 mt-4 max-w-xl mx-auto">
    Os maiores nomes da música dominando o palco principal.
  </p>
</div>

  <div className="grid md:grid-cols-4 gap-10">
    {headliners.map((artist) => (
      <div
        key={artist.id}
        className="group relative rounded-2xl overflow-hidden bg-zinc-900/60 backdrop-blur-md border border-purple-500/70 transition-all duration-500 hover:-translate-y-3"
        style={{
          boxShadow: "0 0 80px rgba(168, 85, 247, 0.15)",
        }}
      >
        {/* Glow no hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
          style={{
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)",
          }}
        ></div>

        {/* Imagem */}
        <div className="relative overflow-hidden">
          <img
            src={artist.image}
            alt={artist.name}
            className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        {/* Conteúdo */}
        <div className="relative p-6">
          <h3 className="neon-text text-2xl font-bold text-white tracking-wide group-hover:text-purple-400 transition">
            {artist.name}
          </h3>

          <p className="text-sm text-purple-300 mt-2 uppercase tracking-wider">
            {artist.genre}
          </p>

          <p className="text-sm mt-2 text-gray-400">
            Dia {artist.day}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>


{/* OPENING ACTS */}
<section className="py-24 px-6 bg-zinc-950 relative overflow-hidden">

  {/* Glow de fundo */}
  <div className="absolute inset-0"></div>

  <div className="relative max-w-7xl mx-auto">

  <div className="text-center mb-20">
    <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
      Abertura Oficial
    </h2>
    <p className="text-gray-400 mt-4 max-w-xl mx-auto">
      Três artistas, três noites, o início de uma experiência inesquecível.
    </p>
  </div>

    <div className="grid md:grid-cols-3 gap-12">

      {openingArtists.map((artist, index) => (
        <div
          key={artist.id}
          className="group relative rounded-3xl overflow-hidden backdrop-blur-xl bg-zinc-900/60 border border-purple-500/70 transition-all duration-500 hover:-translate-y-4"
          style={{
            boxShadow: "0 0 80px rgba(168, 85, 247, 0.15)",
          }}
        >

          {/* DIA GIGANTE NO FUNDO */}
          <span className="absolute -top-6 -right-6 text-[120px] font-extrabold text-purple-500/10 select-none">
            {index + 1}
          </span>

          {/* IMAGEM */}
          <div className="relative overflow-hidden">
            <img
              src={artist.image}
              alt={artist.name}
              className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* overlay escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          {/* CONTEÚDO */}
          <div className="relative p-8">

            {/* Badge */}
            <span className="inline-block text-xs tracking-widest uppercase text-purple-400 mb-4">
              Primeiros Beats
            </span>

            <h3 className="neon-text text-3xl font-bold text-white group-hover:text-purple-400 transition">
              {artist.name}
            </h3>

            <p className="text-purple-300 mt-3 uppercase tracking-wide text-sm">
              {artist.genre}
            </p>

            <p className="text-gray-400 mt-2">
              Dia {artist.day} • 18:00
            </p>

          </div>

          {/* Glow hover forte */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
            style={{
              boxShadow: "0 0 60px rgba(168, 85, 247, 0.4)",
            }}
          ></div>

        </div>
      ))}

    </div>

  </div>
</section>

      {/* STAGES */}
      <section className="py-24 px-6">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
            Experiência Multi-Palco
            </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Uma jornada sonora que atravessa estilos, 
            luzes e sensações.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="bg-zinc-900 p-6 rounded-2xl"
            >
              <h3 className="neon-text text-2xl font-bold mb-2">
                {stage.name}
              </h3>
              <p className="text-gray-400 mb-2">
                Capacidade: {stage.capacity.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Estilo: {stage.style}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCAL EVENTO */}

      <section className="py-24 px-6 bg-zinc-950">
  <div className="max-w-7xl mx-auto">

    {/* TÍTULO */}
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-bold neon-text">
        Local do Festival
      </h2>
      <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
        Tudo o que você precisa saber para chegar ao Neon Sound Festival 2027.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-16 items-start">

      {/* COLUNA ESQUERDA */}
      <div className="space-y-10 grid md:grid-cols-2">

        {/* Endereço */}
        <div>
          <h3 className="text-2xl font-bold neon-text mb-4">
             Endereço
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Neon Sound Festival 2026 <br />
            Autódromo de Interlagos <br />
            Av. Senador Lago Branco, 251 <br />
            Interlagos – São Paulo/SP <br />
            CEP 07801-020
          </p>

          <a
            href="https://www.google.com/maps?q=Autódromo+de+Interlagos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium inline-block mt-4 text-purple-400 hover:text-purple-300 transition"
          >
            🔗 Ver no Google Maps
          </a>
        </div>

        {/* Transporte */}
        <div>
          <h3 className="text-2xl font-bold neon-text mb-4">
             Transporte Público
          </h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Estação Autódromo (Linha 8 – Esmeralda)</li>
            <li>• Linhas especiais de ônibus do metrô</li>
            <li>• Uber / 99 com ponto oficial do evento</li>
          </ul>
        </div>

        {/* Estacionamento */}
        <div>
          <h3 className="text-2xl font-bold neon-text mb-4">
             Estacionamento
          </h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Estacionamento oficial do evento</li>
            <li>• Vagas limitadas</li>
            <li>• Compra antecipada recomendada</li>
          </ul>
        </div>

        {/* Extras Profissionais */}
        <div>
          <h3 className="text-2xl font-bold neon-text mb-4">
             Informações Importantes
          </h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Portões abrem às 12h</li>
            <li>• Primeiros shows às 14h - 16h</li>
            <li>• Área de alimentação completa</li>
            <li>• Posto médico e segurança 24h</li>
            <li>• Acessibilidade garantida </li>
          </ul>
        </div>

      </div>

      {/* COLUNA DIREITA – MAPA */}
      <div className="rounded-2xl overflow-hidden border border-purple-500/40 shadow-lg"
        style={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.2)",
        }}
      >
        <iframe
          title="Mapa Autódromo de Interlagos"
          src="https://www.google.com/maps?q=Autódromo+de+Interlagos&output=embed"
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>

    </div>
  </div>
</section>

      {/* TICKETS */}
      <section className="py-24">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-bold neon-text">
        Tipos de Ingresso
      </h2>
      <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
        Escolha sua experiência e prepare-se para viver o Neon Sound Festival 
        do seu jeito.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-3xl cursor-pointer hover:border-purple-500 hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-2
          "
        >
          <h3 className="neon-text text-2xl font-bold mb-2">
            {ticket.name}
          </h3>

          <p className="text-gray-400">
            {ticket.currentBatch}
          </p>

          <p className="text-3xl font-bold mt-2">
  {formatPriceTickets(ticket.price)}
</p>

          <p className="text-sm text-gray-500 mt-1">
  {formatNumberTickets(ticket.remaining)} restantes
</p>

          <button onClick={() => navigate(`/ingressos?ticket=${ticket.id}`)} className="mt-6 w-full neon-button transition-all duration-300 text-white py-2 hover:bg-purple-600 px-4 rounded-full border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] cursor-pointer neon-text font-bold
          ">
            Comprar
          </button>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* STATS */}
      <section className="bg-zinc-950 py-24 px-6 text-center">
        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <div>
            <p className="text-4xl font-bold">+{stats.artists}</p>
            <p className="text-gray-400">Artistas Confirmados</p>
          </div>
          <div>
            <p className="text-4xl font-bold">
              +{stats.sold.toLocaleString()}
            </p>
            <p className="text-gray-400">Ingressos Vendidos</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats.stages}</p>
            <p className="text-gray-400">Palcos</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats.days}</p>
            <p className="text-gray-400">Dias de Festival</p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-6 text-center">
        <h2 className="neon-text text-4xl font-bold mb-6">
          Receba Novidades do Festival
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-xl mx-auto">
          <input
  type="email"
  placeholder="Seu email"
  value={newsletterEmail}
  onChange={(e) => setNewsletterEmail(e.target.value)}
  className="
    px-4
    py-3
    rounded-full
    bg-zinc-900
    border
    border-zinc-700
    text-white
    placeholder-gray-400
    w-full
    focus:outline-none
    focus:border-[var(--neon-purple)]
    focus:shadow-[0_0_6px_var(--neon-purple)]
    transition-all
  "
/>
          <button className="neon-button transition-all duration-300  cursor-pointer px-6 rounded-full font-bold text-white py-2 hover:bg-purple-600 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] neon-text
          ">
            Inscrever
          </button>
        </div>
      </section>
    </div>
  );
}