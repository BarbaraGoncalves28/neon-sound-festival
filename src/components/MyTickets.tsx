import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
import auroraLogo from "../assets/images/auroraLogo.png";
import electroLogo from "../assets/images/electroLogo.png";
import lunarLogo from "../assets/images/lunarLogo.png";
import { Trash2 } from "lucide-react";

/* =========================
   TYPES
========================= */

type Ticket = {
  id: string;
  type: string;
  day: number;
  qr: string;
  ownerEmail: string;
};

type Artist = {
  id: string;
  name: string;
  genre: string;
  image: string;
};

type Performance = {
  artistId: string;
  day: number;
  start: string;
  stage: string;
};

type EventHistory = {
  id: string;
  name: string;
  year: number;
  city: string;
  logo: string;
};

type MapLocation = {
  id: string;
  name: string;
  type: "stage" | "food" | "bathroom" | "shop";
  x: number;
  y: number;
};

/* =========================
   MOCK DATA
========================= */

const artists: Artist[] = [
  {
    id: "1",
    name: "Maya Skyline",
    genre: "Pop",
    image: singerpopone,
  },
  {
    id: "2",
    name: "MC Eclipse",
    genre: "Rap/Hip-Hop",
    image: singerrapone,
  },
  {
    id: "3",
    name: "Crimson Avenue",
    genre: "Rock",
    image: singerrockone,
  },
  {
    id: "4",
    name: "Neon Aurora",
    genre: "Pop/Electronic",
    image: singerpoptwo,
  },
  {
    id: "5",
    name: "Lex Phantom",
    genre: "Rap/Hip-Hop",
    image: singerraptwo,
  },
  {
    id: "6",
    name: "Atlas Riff",
    genre: "Rock",
    image: singerrocktwo,
  },
  {
    id: "7",
    name: "Kai Solaris",
    genre: "Pop",
    image: singerpopthree,
  },
  {
    id: "8",
    name: "Razor Nova",
    genre: "Rap/Hip-Hop",
    image: singerrapthree,
  },
  {
    id: "9",
    name: "Midnight Reactor",
    genre: "Rock",
    image: singerrockthree,
  },
  {
    id: "10",
    name: "Velvet Bloom",
    genre: "Pop/Electronic",
    image: singerpopfour,
  },
  {
    id: "11",
    name: "Zyro Blaze",
    genre: "Rap/Hip-Hop",
    image: singerrapfour,
  },
  {
    id: "12",
    name: "Electric Dominion",
    genre: "Rock",
    image: singerrockfour,
  },
  {
    id: "13",
    name: "J Luna",
    genre: "Pop",
    image: singerpopfive,
  },
  {
    id: "14",
    name: "Krown Zero",
    genre: "Rap",
    image: singerrapfive,
  },
  {
    id: "15",
    name: "Silver Howl",
    genre: "Rock",
    image: singerrockfive,
  }, 
  {
    id: "16",
    name: "The Weeknd",
    genre: "Dance-pop/R&B",
    image: openingone,
  },
  {
    id: "17",
    name: "Ariana Grande",
    genre: "Pop R&B/Dance",
    image: openingtwo,
  },
  {
    id: "18",
    name: "Dua Lipa",
    genre: "Dance/Electropop",
    image: openingthree,
  } 
];

const performances: Performance[] = [
  { artistId: "1", day: 28, start: "20:40", stage: "Palco B" },
  { artistId: "2", day: 30, start: "01:30", stage: "Palco A" },
  { artistId: "3", day: 28, start: "01:30", stage: "Palco A" },
  { artistId: "4", day: 30, start: "23:50", stage: "Palco Alternativo" },
  { artistId: "5", day: 28, start: "22:10", stage: "Palco Eletrônico" },
  { artistId: "6", day: 29, start: "01:30", stage: "Palco A" },
  { artistId: "7", day: 28, start: "19:20", stage: "Palco A" },
  { artistId: "8", day: 28, start: "23:50", stage: "Palco Alternativo" },
  { artistId: "9", day: 29, start: "19:20", stage: "Palco A" },
  { artistId: "10", day: 30, start: "19:20", stage: "Palco A" },
  { artistId: "11", day: 30, start: "20:40", stage: "Palco B" },
  { artistId: "12", day: 29, start: "20:40", stage: "Palco B" },
  { artistId: "13", day: 29, start: "22:10", stage: "Palco Eletrônico" },
  { artistId: "14", day: 30, start: "22:10", stage: "Palco Eletrônico" },
  { artistId: "15", day: 29, start: "23:50", stage: "Palco Alternativo" },
  { artistId: "16", day: 28, start: "18:00", stage: "Palco A" },
  { artistId: "17", day: 29, start: "18:00", stage: "Palco B" },
  { artistId: "18", day: 30, start: "18:00", stage: "Palco B" },
];

const initialTickets: Ticket[] = [
  {
    id: "T1",
    type: "VIP",
    day: 28,
    ownerEmail: "user@email.com",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=T1",
  },
];

const eventHistory: EventHistory[] = [
  { id: "1", name: "Aurora Beats", year: 2023, city: "São Paulo", logo: auroraLogo, },
  { id: "2", name: "Electro Summer", year: 2022, city: "Rio de Janeiro", logo: electroLogo, },
  { id: "3", name: "Lunar Fest", year: 2021, city: "Rio de Janeiro", logo: lunarLogo, },
];

const festivalMap: MapLocation[] = [
  { id: "stageA", name: "Palco A", type: "stage", x: 20, y: 40 },
  { id: "stageB", name: "Palco B", type: "stage", x: 70, y: 50 },
  { id: "stageEletronico", name: "Palco Eletrônico", type: "stage", x: 45, y: 20 },
  { id: "stageAlt", name: "Palco Alternativo", type: "stage", x: 40, y: 75 },

  { id: "food", name: "Food Trucks", type: "food", x: 40, y: 70 },
  { id: "bathroom", name: "Banheiros", type: "bathroom", x: 60, y: 20 },
  { id: "merch", name: "Merch", type: "shop", x: 15, y: 60 },
];

/* =========================
   COMPONENT
========================= */

export default function MeusIngressos() {

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [musicPrefs, setMusicPrefs] = useState<string[]>([]);

/* =========================
   FAVORITES
========================= */

function toggleFavorite(id: string) {

  if (favorites.includes(id)) {
    setFavorites(favorites.filter((f) => f !== id));
  } else {
    setFavorites([...favorites, id]);
  }

}

/* =========================
   MUSIC GENRES
========================= */

function toggleGenre(genre: string) {

  if (musicPrefs.includes(genre)) {
    setMusicPrefs(musicPrefs.filter((g) => g !== genre));
  } else {
    setMusicPrefs([...musicPrefs, genre]);
  }

}

/**================= */

useEffect(() => {
  const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  setTickets(storedTickets);
}, []);

/* =========================
   NOTIFICATION SYSTEM
========================= */

useEffect(() => {

  const interval = setInterval(() => {

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    performances.forEach((perf) => {

      const start =
        Number(perf.start.split(":")[0]) * 60 +
        Number(perf.start.split(":")[1]);

      if (
        favorites.includes(perf.artistId) &&
        start - currentTime === 10
      ) {

        const artist = artists.find(
          (a) => a.id === perf.artistId
        );

        toast(`${artist?.name} começa em 10 minutos no ${perf.stage}!`, {
          icon: "🎤",
        });

      }

    });

  }, 60000);

  return () => clearInterval(interval);

}, [favorites]);

function removeFromFavorites(artistId: string) {
  setFavorites((prev) => prev.filter((id) => id !== artistId));
}

/* =========================
   RENDER
========================= */

return (

<div className="bg-black text-white min-h-screen py-20 ">

<div className="w-full space-y-20">

<h2 className="text-4xl md:text-5xl font-bold text-center neon-text mt-10">
      Meus Ingressos
  </h2>

{/* =========================
   MEUS INGRESSOS
========================= */}

<section>
  <div  className="max-w-7xl mx-auto px-6">

{tickets.length === 0 ? (
  <p className="text-center text-gray-400 mt-10">
    Você ainda não comprou nenhum ingresso 
    </p>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">


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

<div className="flex gap-2">
</div>

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
  <div className="max-w-7xl mx-auto px-6">

  <div className="text-center mb-20">
  <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
      Artistas Favoritos
  </h2>
  <p className="text-gray-400 mt-4 max-w-xl mx-auto">
    Marque seus artistas preferidos para receber alertas antes do show começar.
  </p>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">

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

<p className="text-xs text-gray-400">
{artist.genre}
</p>

<button
onClick={() => toggleFavorite(artist.id)}
className={`cursor-pointer mt-2 px-2 py-1 text-xs rounded ${
favorites.includes(artist.id)
? "bg-purple-700"
: "bg-purple-400"
}`}
>

{favorites.includes(artist.id)
? "Favoritado"
: "Favoritar"}

</button>

</div>

</div>

))}

</div>

{/* =========================
   MINHA PROGRAMAÇÃO
========================= */}

<section className="py-24">
  <div className="max-w-7xl mx-auto px-6">

<h2 className="text-4xl md:text-5xl font-bold text-center neon-text mt-20">
      Minha Programação
  </h2>

<div className="space-y-4 mt-5">

{performances
.filter((p) =>
favorites.includes(p.artistId)
)
.map((perf, i) => {

const artist = artists.find(
(a) => a.id === perf.artistId
);

return (

<div
key={i}
className="border border-purple-500/40 p-4 rounded-xl flex justify-between items-center"
>

<div>

<h3 className="font-bold neon-text">
{artist?.name}
</h3>

<p className="text-sm text-gray-400">
{perf.stage}
</p>

</div>

<div className="flex items-center gap-8">
  <div className="text-right">
<p className="neon-text font-semibold">Dia {perf.day}</p>
<p className="text-gray-400">{perf.start}</p>
</div>
<button
      onClick={() => removeFromFavorites(perf.artistId)}
      className="text-red-400 hover:text-red-600 transition cursor-pointer"
    >
      <Trash2 size={18} />
    </button>

</div>
</div>

);

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
      <p className="text-gray-400 mt-4 max-w-xl mx-auto">Reviva os festivais que fizeram parte da sua jornada musical.</p>
  </div>

<div className="grid md:grid-cols-3 gap-6">

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

<h3 className="neon-text font-semibold">
{event.name}
</h3>

<p className="text-gray-400">
{event.city}
</p>

<strong className="neon-text">
{event.year}
</strong>

</div>

))}

</div>
</div>

</section>

</div>

</div>

);

}