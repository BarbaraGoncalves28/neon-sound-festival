import { useMemo, useState } from "react";
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

/* =========================
   TYPES
========================= */

type Stage = {
  id: string;
  name: string;
};

type Artist = {
  id: string;
  name: string;
  genre: string;
  image: string;
  headliner?: boolean;
  opening?: boolean;
};

type Performance = {
  id: string;
  artistId: string;
  stageId: string;
  day: number;
  start: string;
  end: string;
};

/* =========================
   MOCK DATA
========================= */

const stages: Stage[] = [
  { id: "A", name: "Palco A" },
  { id: "B", name: "Palco B" },
  { id: "E", name: "Palco Eletrônico" },
  { id: "ALT", name: "Palco Alternativo" },
];

const artists: Artist[] = [  
    { id: "1", name: "Maya Skyline", genre: "Pop", image: singerpopone, headliner: true},
    { id: "2", name: "MC Eclipse", genre: "Rap/Hip-Hop", image: singerrapone, },
    { id: "3", name: "Crimson Avenue", genre: "Rock", image: singerrockone, headliner: true},
    { id: "4", name: "Neon Aurora", genre: "Pop/Electronic", image: singerpoptwo,},
    { id: "5", name: "Lex Phantom", genre: "Rap/Hip-Hop", image: singerraptwo, headliner: true},
    { id: "6", name: "Atlas Riff", genre: "Rock", image: singerrocktwo, },
    { id: "7", name: "Kai Solaris", genre: "Pop", image: singerpopthree, headliner: true},
    { id: "8", name: "Razor Nova", genre: "Rap/Hip-Hop", image: singerrapthree, headliner: true},
    { id: "9", name: "Midnight Reactor", genre: "Rock", image: singerrockthree, headliner: true},
    { id: "10", name: "Velvet Bloom", genre: "Pop/Electronic", image: singerpopfour, },
    { id: "11", name: "Zyro Blaze", genre: "Rap/Hip-Hop", image: singerrapfour, },
    { id: "12", name: "Electric Dominion", genre: "Rock", image: singerrockfour, headliner: true},
    { id: "13", name: "J Luna", genre: "Pop", image: singerpopfive, headliner: true},
    { id: "14", name: "Krown Zero", genre: "Rap", image: singerrapfive, },
    { id: "15", name: "Silver Howl", genre: "Rock", image: singerrockfive, headliner: true},

    { id: "16", name: "The Weeknd", genre: "Dance-pop/R&B", image: openingone, opening: true },
    { id: "17", name: "Ariana Grande", genre: "Pop R&B/Dance", image: openingtwo, opening: true },
    { id: "18", name: "Dua Lipa", genre: "Dance/Electropop", image: openingthree, opening: true },
];

const performances: Performance[] = [

  // DIA 1
  { id: "p1", artistId: "16", stageId: "A", day: 28, start: "18:00", end: "19:00" },
  { id: "p2", artistId: "7", stageId: "A", day: 28, start: "19:20", end: "20:20" },
  { id: "p3", artistId: "1", stageId: "B", day: 28, start: "20:40", end: "21:50" },
  { id: "p4", artistId: "5", stageId: "E", day: 28, start: "22:10", end: "23:30" },
  { id: "p5", artistId: "8", stageId: "ALT", day: 28, start: "23:50", end: "01:10" },
  { id: "p6", artistId: "3", stageId: "A", day: 28, start: "01:30", end: "03:00" },


  // DIA 2
  { id: "p7", artistId: "17", stageId: "B", day: 29, start: "18:00", end: "19:00" },
  
  { id: "p8", artistId: "9", stageId: "A", day: 29, start: "19:20", end: "20:20" },
  { id: "p9", artistId: "12", stageId: "B", day: 29, start: "20:40", end: "21:50" },
  { id: "p10", artistId: "13", stageId: "E", day: 29, start: "22:10", end: "23:30" },
  { id: "p11", artistId: "15", stageId: "ALT", day: 29, start: "23:50", end: "01:10" },
  { id: "p12", artistId: "6", stageId: "A", day: 29, start: "01:30", end: "03:00" },


  // DIA 3
  { id: "p13", artistId: "18", stageId: "ALT", day: 30, start: "18:00", end: "19:00" },

  { id: "p14", artistId: "10", stageId: "A", day: 30, start: "19:20", end: "20:20" },
  { id: "p15", artistId: "11", stageId: "B", day: 30, start: "20:40", end: "21:50" },
  { id: "p16", artistId: "14", stageId: "E", day: 30, start: "22:10", end: "23:30" },
  { id: "p17", artistId: "4", stageId: "ALT", day: 30, start: "23:50", end: "01:10" },
  { id: "p18", artistId: "2", stageId: "A", day: 30, start: "01:30", end: "03:00" },

];

/* HELPERS */

function timeToMinutes(time: string) {
  let [h, m] = time.split(":").map(Number);

  if (h < 6) {
    h += 24;
  }

  return h * 60 + m;
}

const timelineStart = 18 * 60;
const timelineEnd = 27 * 60; 
const timelineDuration = timelineEnd - timelineStart;

const genreColors: Record<string, string> = {
  Pop: "bg-pink-500/20 border border-pink-500/40 text-pink-200",
  "Pop/Electronic": "bg-pink-500/20 border border-pink-500/40 text-pink-200",

  "Rap/Hip-Hop": "bg-purple-500/20 border border-purple-500/40 text-purple-200",
  Rap: "bg-purple-500/20 border border-purple-500/40 text-purple-200",

  Rock: "bg-indigo-500/20 border border-indigo-500/40 text-indigo-200",
};

/* COMPONENT */

export function LineupPage() {

  const [dayFilter, setDayFilter] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");

  const filteredPerformances = useMemo(() => {
    return performances.filter((p) => {
      if (dayFilter !== "all" && p.day !== dayFilter) return false;
      return true;
    });
  }, [dayFilter]);

  return (

<div className="min-h-screen text-white px-6 py-20 mt-20">

<div className="max-w-7xl mx-auto">

{/* HERO */}

<div className="text-center mb-16">

 <h2 className="text-4xl md:text-5xl font-bold text-center neon-text">
      Line Up
</h2>

<p className="text-gray-400 mt-4">
3 dias • 4 palcos • +15 artistas
</p>

</div>

{/* DAY FILTER */}

<div className="flex gap-3 mb-12 justify-center">

{(viewMode === "timeline" ? [28,29,30] : ["all",28,29,30]).map((d)=>(
<button
key={d}
onClick={()=>setDayFilter(d as any)}
className={`neon-text font-medium cursor-pointer px-5 py-2 rounded-full border
${dayFilter===d?"neon-text border-purple-500":"border-zinc-700"}`}
>
{d === "all" ? "Todos" : `Dia ${d}`}
</button>
))}

</div>

{/* VIEW MODE */}

<div className="flex justify-end mb-10">

<div className="bg-zinc-900 rounded-lg p-1 flex gap-1">

<button
onClick={()=>setViewMode("grid")}
className={`font-medium neon-text cursor-pointer px-4 py-1 rounded ${viewMode==="grid"&&"bg-purple-500"}`}
>
Grid
</button>

<button
onClick={()=>{
  setViewMode("timeline");
  if(dayFilter === "all") setDayFilter(28);
}}
className={`font-medium neon-text cursor-pointer px-4 py-1 rounded ${viewMode==="timeline"&&"bg-purple-500"}`}
>
Timeline
</button>

</div>

</div>

{/* GRID VIEW */}

{viewMode==="grid"&&(

<div className="grid md:grid-cols-3 gap-8">

{filteredPerformances.map((perf)=>{

const artist=artists.find(a=>a.id===perf.artistId)!;
const stage=stages.find(s=>s.id===perf.stageId)!;

return(

<div key={perf.id} className="group relative rounded-xl overflow-hidden">

<img
src={artist.image}
className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/>

<div className="absolute bottom-4 left-4">

<h3 className="neon-text text-2xl font-bold">{artist.name}</h3>

<p className="text-gray-300 text-sm">{artist.genre}</p>

<p className="text-purple-400 text-xs mt-1">
{stage.name} • {perf.start} - {perf.end}
</p>

</div>

</div>

)

})}

</div>

)}

{/* TIMELINE */}

{viewMode==="timeline"&&(

<div className="overflow-x-auto">

<div className="relative border border-zinc-800 rounded-xl">

<div className="relative h-10 border-b border-zinc-800 text-sm">
    <div className="absolute left-0 w-40"></div>

    <div className="ml-40 relative h-full">
{Array.from({ length: 10 }).map((_, i) => {
  const hour = 18 + i;
  const display = hour >= 24 ? hour - 24 : hour;
  const minutes=hour*60;

  const left=((minutes-timelineStart)/timelineDuration)*100

  return (
    <div key={i} className={`absolute text-xs top-2 text-gray-400 neon-text ${
        i === 0
          ? "translate-x-0"
          : i === 9
          ? "-translate-x-full"
          : "-translate-x-1/2"
      }`} style={{left:`${left}%`}}>
      {display}:00
    </div>
  );
})}
</div>
</div>

{stages.map(stage=>(

<div key={stage.id} className="relative h-20 border-b border-zinc-800">

<div className="absolute left-0 w-40 h-full flex items-center pl-4 font-medium neon-text">
{stage.name}
</div>

<div className="ml-40 relative h-full">
    {Array.from({ length: 10 }).map((_, i) => (
  <div
    key={i}
    className="absolute top-0 bottom-0 border-l border-zinc-800"
    style={{ left: `${(i / 9) * 100}%` }}
  />
))}

{filteredPerformances
.filter(p=>p.stageId===stage.id)
.map(perf=>{

const artist=artists.find(a=>a.id===perf.artistId)!;

const genreColor = genreColors[artist.genre] || "bg-red-500/20 border border-red-500/40 text-red-200";

const start=timeToMinutes(perf.start);
const end=timeToMinutes(perf.end);

const left=((start-timelineStart)/timelineDuration)*100;
const width=((end-start)/timelineDuration)*100;

return(

<div
key={perf.id}
className={`neon-text font-medium absolute top-2 bottom-2 rounded-lg px-3 flex items-center gap-2 text-xs
${genreColor}
hover:brightness-125 transition`}
style={{left:`${left}%`,width:`${width}%`}}
>

<img src={artist.image} alt={artist.name} className="w-5 h-5 rounded object-cover" />

{artist.name}

</div>

)

})}

</div>

</div>

))}

</div>

</div>

)}

</div>

</div>

  );
}