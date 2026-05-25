export type Artist = {
  id: string;
  name: string;
  genre: string;
  time: string;
  openingsinger?: boolean,
  headliner?: boolean;
  newWave?: boolean;
}

export type Stage = {
  id: string;
  name: string;
  capacity: number
  blocked?: boolean
  type?: "main" | "newWave";
}

export type Performance = {
  id: string
  artistId: string
  openingArtistId?: string
  stageId: string
  day: number
  start: string
  end: string
}

// ==============================
// 🎟 SISTEMA PROFISSIONAL DE INGRESSOS
// ==============================

export type PhaseStatus = "upcoming" | "active" | "soldout"

export type TicketPhase = {
  id: string
  name: string
  price: number
  limit: number
  sold: number
  status: PhaseStatus
}

export type TicketType = {
  id: string
  name: string
  description: string
  phases: TicketPhase[]
}

export type Batch = {
  id: string
  name: string
  price: number
  limit: number
  sold: number
}

export const store = {
  artists: [
  // 🎤 TODOS OS ARTISTAS DO FESTIVAL

  // ======================
  // 🌟 HEADLINERS
  // ======================
  {
    id: "h1",
    name: "The Weeknd",
    genre: "Dance-pop/R&B",
    openingsinger: true
  },
  {
    id: "h2",
    name: "Ariana Grande",
    genre: "Pop R&B/Dance",
    openingsinger: true
  },
  {
    id: "h3",
    name: "Dua Lipa",
    genre: "Dance/Electropop",
    openingsinger: true
  },

  // ======================
  // 🎸 MAIN ARTISTS
  // ======================
  {
    id: "1",
    name: "Maya Skyline",
    genre: "Pop",
    headliner: true
  },
  {
    id: "2",
    name: "MC Eclipse",
    genre: "Rap/Hip-Hop",
    headliner: true
  },
  {
    id: "3",
    name: "Crimson Avenue",
    genre: "Rock",
    headliner: true
  },
  {
    id: "4",
    name: "Neon Aurora",
    genre: "Pop/Electronic",
    headliner: true
  },
  {
    id: "5",
    name: "Lex Phantom",
    genre: "Rap/Hip-Hop",
    headliner: true
  },
  {
    id: "6",
    name: "Atlas Riff",
    genre: "Rock",
    headliner: true
  },
  {
    id: "7",
    name: "Kai Solaris",
    genre: "Pop",
    headliner: true
  },
  {
    id: "8",
    name: "Razor Nova",
    genre: "Rap/Hip-Hop",
    headliner: true
  },
  {
    id: "9",
    name: "Midnight Reactor",
    genre: "Rock",
    headliner: true
  },
  {
    id: "10",
    name: "Velvet Bloom",
    genre: "Pop/Electronic",
    headliner: true
  },
  {
    id: "11",
    name: "Zyro Blaze",
    genre: "Rap/Hip-Hop",
    headliner: true
  },
  {
    id: "12",
    name: "Electric Dominion",
    genre: "Rock",
    headliner: true
  },
  {
    id: "13",
    name: "J Luna",
    genre: "Pop",
    headliner: true
  },
  {
    id: "14",
    name: "Krown Zero",
    genre: "Rap",
    headliner: true
  },
  {
    id: "15",
    name: "Silver Howl",
    genre: "Rock",
    headliner: true
  },

  // ======================
  // 🌊 NEW WAVE
  // ======================
  {
    id: "nw1",
    name: "SkyRush",
    genre: "Pop",
    day: 28,
    newWave: true
  },
  {
    id: "nw2",
    name: "MC Drift",
    genre: "Rap/Hip-Hop",
    day: 28,
    newWave: true
  },
  {
    id: "nw3",
    name: "Voltage Saints",
    genre: "Rock",
    day: 29,
    newWave: true
  }
] as Artist[],

  // 🎪 Palcos
  stages: [
    {
      id: "s1",
      name: "Palco Flow",
      capacity: 3000,
      type: "newWave"
    },
    {
      id: "s2",
      name: "Palco Next",
      capacity: 4000,
      type: "newWave"
    },
    {
      id: "s3",
      name: "Palco Prime",
      capacity: 8000,
      type: "newWave"
    },
    {
      id: "s4",
      name: "Palco A",
      capacity: 100000,
      type: "main"
    },
    {
      id: "s5",
      name: "Palco B",
      capacity: 60000,
      type: "main"
    },
    {
      id: "s6",
      name: "Palco Eletrônico",
      capacity: 40000,
      type: "main"
    },
    {
      id: "s7",
      name: "Palco Alternativo",
      capacity: 20000,
      type: "main"
    },
  ] as Stage[],
  performances: [] as Performance[],

  // 🎟 Lotes de ingressos
  // 🎟 TIPOS DE INGRESSO (PRO)
  ticketTypes: [

    // ======================
    // 🎟 PISTA
    // ======================
    {
      id: "pista",
      name: "Pista",
      description: "Acesso à área geral em frente ao palco",
      phases: [
        {
          id: "pista-eb",
          name: "Early Bird",
          price: 550,
          limit: 22400,
          sold: 19150,
          status: "soldout"
        },
        {
          id: "pista-l1",
          name: "1º Lote",
          price: 650,
          limit: 44800,
          sold: 34156,
          status: "active"
        },
        {
          id: "pista-l2",
          name: "2º Lote",
          price: 750,
          limit: 44800,
          sold: 29551,
          status: "upcoming"
        }
      ]
    },

    // ======================
    // 🎟 VIP
    // ======================
    {
      id: "vip",
      name: "VIP",
      description: "Área premium + bares exclusivos",
      phases: [
        {
          id: "vip-eb",
          name: "Early Bird",
          price: 990,
          limit: 14000,
          sold: 11826,
          status: "soldout"
        },
        {
          id: "vip-l1",
          name: "1º Lote",
          price: 1200,
          limit: 22400,
          sold: 16404,
          status: "active"
        },
        {
          id: "vip-l2",
          name: "2º Lote",
          price: 1400,
          limit: 19600,
          sold: 11713,
          status: "upcoming"
        }
      ]
    },

    // ======================
    // 🎟 BACKSTAGE
    // ======================
    {
      id: "backstage",
      name: "Backstage",
      description: "Acesso backstage + open bar + meet & greet",
      phases: [
        {
          id: "backstage-eb",
          name: "Early Bird",
          price: 2200,
          limit: 4200,
          sold: 2785,
          status: "soldout"
        },
        {
          id: "backstage-l1",
          name: "1º Lote",
          price: 2500,
          limit: 5600,
          sold: 1124,
          status: "active"
        },
        {
          id: "backstage-l2",
          name: "2º Lote",
          price: 2900,
          limit: 4200,
          sold: 815,
          status: "upcoming"
        }
      ]
    },

    // ======================
    // 🎟 MEIA ENTRADA
    // ======================
    {
      id: "meia",
      name: "Meia-entrada",
      description: "Ingresso com benefício estudantil",
      phases: [
        {
          id: "meia-l1",
          name: "1º Lote",
          price: 325,
          limit: 28000,
          sold: 22345,
          status: "active"
        },
        {
          id: "meia-l2",
          name: "2º Lote",
          price: 375,
          limit: 28000,
          sold: 18456,
          status: "upcoming"
        }
      ]
    },

    // ======================
    // 🎟 PASSAPORTE 3 DIAS
    // ======================
    {
      id: "passaporte",
      name: "Passaporte 3 Dias",
      description: "Acesso completo aos 3 dias do festival",
      phases: [
        {
          id: "pass-eb",
          name: "Early Bird",
          price: 1400,
          limit: 12600,
          sold: 10815,
          status: "soldout"
        },
        {
          id: "pass-l1",
          name: "1º Lote",
          price: 1650,
          limit: 16800,
          sold: 14623,
          status: "active"
        },
        {
          id: "pass-l2",
          name: "2º Lote",
          price: 1900,
          limit: 12600,
          sold: 10117,
          status: "upcoming"
        }
      ]
    }

  ] as TicketType[]
}