import {
  getStoredArtists,
  getStoredPerformances,
  getStoredStages,
} from './adminPersistence'

export type Artist = {
  id: string
  name: string
  genre: string
  time?: string
  day?: number
  openingsinger?: boolean
  headliner?: boolean
  newWave?: boolean
  canceled?: boolean
}

export type Stage = {
  id: string
  name: string
  capacity: number
  blocked?: boolean
  type?: 'main' | 'newWave'
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

export type PhaseStatus = 'upcoming' | 'active' | 'soldout'

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
  artists: getStoredArtists(),
  stages: getStoredStages(),
  performances: getStoredPerformances(),

  // 🎟 Lotes de ingressos
  // 🎟 TIPOS DE INGRESSO (PRO)
  ticketTypes: [
    // ======================
    // 🎟 PISTA
    // ======================
    {
      id: 'pista',
      name: 'Pista',
      description: 'Acesso à área geral em frente ao palco',
      phases: [
        {
          id: 'pista-eb',
          name: 'Early Bird',
          price: 550,
          limit: 22400,
          sold: 19150,
          status: 'soldout',
        },
        {
          id: 'pista-l1',
          name: '1º Lote',
          price: 650,
          limit: 44800,
          sold: 34156,
          status: 'active',
        },
        {
          id: 'pista-l2',
          name: '2º Lote',
          price: 750,
          limit: 44800,
          sold: 29551,
          status: 'upcoming',
        },
      ],
    },

    // ======================
    // 🎟 VIP
    // ======================
    {
      id: 'vip',
      name: 'VIP',
      description: 'Área premium + bares exclusivos',
      phases: [
        {
          id: 'vip-eb',
          name: 'Early Bird',
          price: 990,
          limit: 14000,
          sold: 11826,
          status: 'soldout',
        },
        {
          id: 'vip-l1',
          name: '1º Lote',
          price: 1200,
          limit: 22400,
          sold: 16404,
          status: 'active',
        },
        {
          id: 'vip-l2',
          name: '2º Lote',
          price: 1400,
          limit: 19600,
          sold: 11713,
          status: 'upcoming',
        },
      ],
    },

    // ======================
    // 🎟 BACKSTAGE
    // ======================
    {
      id: 'backstage',
      name: 'Backstage',
      description: 'Acesso backstage + open bar + meet & greet',
      phases: [
        {
          id: 'backstage-eb',
          name: 'Early Bird',
          price: 2200,
          limit: 4200,
          sold: 2785,
          status: 'soldout',
        },
        {
          id: 'backstage-l1',
          name: '1º Lote',
          price: 2500,
          limit: 5600,
          sold: 1124,
          status: 'active',
        },
        {
          id: 'backstage-l2',
          name: '2º Lote',
          price: 2900,
          limit: 4200,
          sold: 815,
          status: 'upcoming',
        },
      ],
    },

    // ======================
    // 🎟 MEIA ENTRADA
    // ======================
    {
      id: 'meia',
      name: 'Meia-entrada',
      description: 'Ingresso com benefício estudantil',
      phases: [
        {
          id: 'meia-l1',
          name: '1º Lote',
          price: 325,
          limit: 28000,
          sold: 22345,
          status: 'active',
        },
        {
          id: 'meia-l2',
          name: '2º Lote',
          price: 375,
          limit: 28000,
          sold: 18456,
          status: 'upcoming',
        },
      ],
    },

    // ======================
    // 🎟 PASSAPORTE 3 DIAS
    // ======================
    {
      id: 'passaporte',
      name: 'Passaporte 3 Dias',
      description: 'Acesso completo aos 3 dias do festival',
      phases: [
        {
          id: 'pass-eb',
          name: 'Early Bird',
          price: 1400,
          limit: 12600,
          sold: 10815,
          status: 'soldout',
        },
        {
          id: 'pass-l1',
          name: '1º Lote',
          price: 1650,
          limit: 16800,
          sold: 14623,
          status: 'active',
        },
        {
          id: 'pass-l2',
          name: '2º Lote',
          price: 1900,
          limit: 12600,
          sold: 10117,
          status: 'upcoming',
        },
      ],
    },
  ] as TicketType[],
}

export function setStoreArtists(artists: Artist[]) {
  store.artists = artists
}

export function setStoreStages(stages: Stage[]) {
  store.stages = stages
}

export function setStorePerformances(performances: Performance[]) {
  store.performances = performances
}
