import auroraLogo from '../assets/images/auroraLogo.png'
import electroLogo from '../assets/images/electroLogo.png'
import homeHero from '../assets/images/home.png'
import lunarLogo from '../assets/images/lunarLogo.png'
import openingOne from '../assets/images/opening-one.jpg'
import openingThree from '../assets/images/opening-three.jpg'
import openingTwo from '../assets/images/opening-two.jpg'
import singerPopFive from '../assets/images/singer-pop-five.png'
import singerPopFour from '../assets/images/singer-pop-four.png'
import singerPopOne from '../assets/images/singer-pop-one.png'
import singerPopThree from '../assets/images/singer-pop-three.png'
import singerPopTwo from '../assets/images/singer-pop-two.png'
import singerRapFive from '../assets/images/singer-rap-five.png'
import singerRapFour from '../assets/images/singer-rap-four.png'
import singerRapOne from '../assets/images/singer-rap-one.png'
import singerRapThree from '../assets/images/singer-rap-three.png'
import singerRapTwo from '../assets/images/singer-rap-two.png'
import singerRockFive from '../assets/images/singer-rock-five.png'
import singerRockFour from '../assets/images/singer-rock-four.png'
import singerRockOne from '../assets/images/singer-rock-one.png'
import singerRockThree from '../assets/images/singer-rock-three.png'
import singerRockTwo from '../assets/images/singer-rock-two.png'

export type FestivalArtist = {
  id: string
  name: string
  genre: string
  day: number
  image: string
  headliner?: boolean
  opening?: boolean
}

export type FestivalStage = {
  id: string
  name: string
  capacity: number
  style: string
}

export type TicketBatch = {
  id: string
  name: string
  price: number
  remaining: number
}

export type TicketCategory = {
  id: string
  name: string
  description: string
  highlight?: string
  batches: TicketBatch[]
}

export type Performance = {
  id: string
  artistId: string
  stageId: string
  day: number
  start: string
  end: string
}

export type EventHistory = {
  id: string
  name: string
  year: number
  city: string
  logo: string
}

export type MapLocation = {
  id: string
  name: string
  type: 'stage' | 'food' | 'bathroom' | 'shop'
  x: number
  y: number
}

export const eventDate = new Date('2027-06-28T18:00:00')
export const festivalDays = [28, 29, 30] as const
export const heroImage = homeHero

export const artists: FestivalArtist[] = [
  {
    id: '1',
    name: 'Maya Skyline',
    genre: 'Pop',
    day: 28,
    image: singerPopOne,
    headliner: true,
  },
  {
    id: '2',
    name: 'MC Eclipse',
    genre: 'Rap/Hip-Hop',
    day: 30,
    image: singerRapOne,
    headliner: true,
  },
  {
    id: '3',
    name: 'Crimson Avenue',
    genre: 'Rock',
    day: 28,
    image: singerRockOne,
    headliner: true,
  },
  {
    id: '4',
    name: 'Neon Aurora',
    genre: 'Pop/Electronic',
    day: 30,
    image: singerPopTwo,
    headliner: true,
  },
  {
    id: '5',
    name: 'Lex Phantom',
    genre: 'Rap/Hip-Hop',
    day: 28,
    image: singerRapTwo,
    headliner: true,
  },
  {
    id: '6',
    name: 'Atlas Riff',
    genre: 'Rock',
    day: 29,
    image: singerRockTwo,
    headliner: true,
  },
  {
    id: '7',
    name: 'Kai Solaris',
    genre: 'Pop',
    day: 28,
    image: singerPopThree,
    headliner: true,
  },
  {
    id: '8',
    name: 'Razor Nova',
    genre: 'Rap/Hip-Hop',
    day: 28,
    image: singerRapThree,
    headliner: true,
  },
  {
    id: '9',
    name: 'Midnight Reactor',
    genre: 'Rock',
    day: 29,
    image: singerRockThree,
    headliner: true,
  },
  {
    id: '10',
    name: 'Velvet Bloom',
    genre: 'Pop/Electronic',
    day: 30,
    image: singerPopFour,
    headliner: true,
  },
  {
    id: '11',
    name: 'Zyro Blaze',
    genre: 'Rap/Hip-Hop',
    day: 30,
    image: singerRapFour,
    headliner: true,
  },
  {
    id: '12',
    name: 'Electric Dominion',
    genre: 'Rock',
    day: 29,
    image: singerRockFour,
    headliner: true,
  },
  {
    id: '13',
    name: 'J Luna',
    genre: 'Pop',
    day: 29,
    image: singerPopFive,
    headliner: true,
  },
  {
    id: '14',
    name: 'Krown Zero',
    genre: 'Rap',
    day: 30,
    image: singerRapFive,
    headliner: true,
  },
  {
    id: '15',
    name: 'Silver Howl',
    genre: 'Rock',
    day: 29,
    image: singerRockFive,
    headliner: true,
  },
  {
    id: '16',
    name: 'The Weeknd',
    genre: 'Dance-pop/R&B',
    day: 28,
    image: openingOne,
    opening: true,
  },
  {
    id: '17',
    name: 'Ariana Grande',
    genre: 'Pop R&B/Dance',
    day: 29,
    image: openingTwo,
    opening: true,
  },
  {
    id: '18',
    name: 'Dua Lipa',
    genre: 'Dance/Electropop',
    day: 30,
    image: openingThree,
    opening: true,
  },
]

export const headliners = artists.filter((artist) => artist.headliner)
export const openingArtists = artists.filter((artist) => artist.opening)

export const stages: FestivalStage[] = [
  {
    id: 'A',
    name: 'Palco A',
    capacity: 100000,
    style: 'Mainstream/Headliners',
  },
  { id: 'B', name: 'Palco B', capacity: 60000, style: 'Rock/Indie' },
  { id: 'E', name: 'Palco Eletrônico', capacity: 40000, style: 'EDM/Techno' },
  {
    id: 'ALT',
    name: 'Palco Alternativo',
    capacity: 20000,
    style: 'Experimental/Novos Artistas',
  },
]

export const performances: Performance[] = [
  {
    id: 'p1',
    artistId: '16',
    stageId: 'A',
    day: 28,
    start: '18:00',
    end: '19:00',
  },
  {
    id: 'p2',
    artistId: '7',
    stageId: 'A',
    day: 28,
    start: '19:20',
    end: '20:20',
  },
  {
    id: 'p3',
    artistId: '1',
    stageId: 'B',
    day: 28,
    start: '20:40',
    end: '21:50',
  },
  {
    id: 'p4',
    artistId: '5',
    stageId: 'E',
    day: 28,
    start: '22:10',
    end: '23:30',
  },
  {
    id: 'p5',
    artistId: '8',
    stageId: 'ALT',
    day: 28,
    start: '23:50',
    end: '01:10',
  },
  {
    id: 'p6',
    artistId: '3',
    stageId: 'A',
    day: 28,
    start: '01:30',
    end: '03:00',
  },
  {
    id: 'p7',
    artistId: '17',
    stageId: 'B',
    day: 29,
    start: '18:00',
    end: '19:00',
  },
  {
    id: 'p8',
    artistId: '9',
    stageId: 'A',
    day: 29,
    start: '19:20',
    end: '20:20',
  },
  {
    id: 'p9',
    artistId: '12',
    stageId: 'B',
    day: 29,
    start: '20:40',
    end: '21:50',
  },
  {
    id: 'p10',
    artistId: '13',
    stageId: 'E',
    day: 29,
    start: '22:10',
    end: '23:30',
  },
  {
    id: 'p11',
    artistId: '15',
    stageId: 'ALT',
    day: 29,
    start: '23:50',
    end: '01:10',
  },
  {
    id: 'p12',
    artistId: '6',
    stageId: 'A',
    day: 29,
    start: '01:30',
    end: '03:00',
  },
  {
    id: 'p13',
    artistId: '18',
    stageId: 'ALT',
    day: 30,
    start: '18:00',
    end: '19:00',
  },
  {
    id: 'p14',
    artistId: '10',
    stageId: 'A',
    day: 30,
    start: '19:20',
    end: '20:20',
  },
  {
    id: 'p15',
    artistId: '11',
    stageId: 'B',
    day: 30,
    start: '20:40',
    end: '21:50',
  },
  {
    id: 'p16',
    artistId: '14',
    stageId: 'E',
    day: 30,
    start: '22:10',
    end: '23:30',
  },
  {
    id: 'p17',
    artistId: '4',
    stageId: 'ALT',
    day: 30,
    start: '23:50',
    end: '01:10',
  },
  {
    id: 'p18',
    artistId: '2',
    stageId: 'A',
    day: 30,
    start: '01:30',
    end: '03:00',
  },
]

export const ticketCatalog: TicketCategory[] = [
  {
    id: 'pista',
    name: 'Pista',
    description:
      'A energia do festival no centro da pista com acesso aos shows principais.',
    highlight: 'Mais popular',
    batches: [
      { id: 'pista-l2', name: 'Lote 2', price: 750, remaining: 112000 },
      { id: 'pista-l3', name: 'Lote 3', price: 820, remaining: 98000 },
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    description:
      'Áreas premium, bares dedicados e visão privilegiada do palco principal.',
    highlight: 'Visão premium',
    batches: [
      { id: 'vip-l1', name: 'Lote 1', price: 1200, remaining: 42000 },
      { id: 'vip-l2', name: 'Lote 2', price: 1450, remaining: 36000 },
    ],
  },
  {
    id: 'backstage',
    name: 'Backstage',
    description:
      'Experiência completa com lounge exclusivo e hospitalidade diferenciada.',
    highlight: 'Experiência máxima',
    batches: [
      { id: 'backstage-l1', name: 'Lote 1', price: 2500, remaining: 8400 },
      { id: 'backstage-l2', name: 'Lote 2', price: 2800, remaining: 6400 },
    ],
  },
  {
    id: 'meiaentrada',
    name: 'Meia-entrada',
    description:
      'Benefício legal com acesso a toda a vibração Neon Sound Festival.',
    highlight: 'Melhor custo-benefício',
    batches: [
      { id: 'meia-l2', name: 'Lote 2', price: 325, remaining: 84000 },
      { id: 'meia-l3', name: 'Lote 3', price: 380, remaining: 72000 },
    ],
  },
  {
    id: 'passaporte',
    name: 'Passaporte 3 dias',
    description:
      'Acesso aos três dias do festival para viver a experiência completa.',
    highlight: 'Acesso completo',
    batches: [
      { id: 'passaporte-l1', name: 'Lote 1', price: 1650, remaining: 33600 },
      { id: 'passaporte-l2', name: 'Lote 2', price: 1890, remaining: 30000 },
    ],
  },
]

export const ticketSummaries = ticketCatalog.map((ticket) => ({
  id: ticket.id,
  name: ticket.name,
  description: ticket.description,
  highlight: ticket.highlight,
  currentBatch: ticket.batches[0]?.name ?? 'Em breve',
  price: ticket.batches[0]?.price ?? 0,
  remaining: ticket.batches.reduce((acc, batch) => acc + batch.remaining, 0),
}))

export const eventHistory: EventHistory[] = [
  {
    id: '1',
    name: 'Aurora Beats',
    year: 2023,
    city: 'São Paulo',
    logo: auroraLogo,
  },
  {
    id: '2',
    name: 'Electro Summer',
    year: 2022,
    city: 'Rio de Janeiro',
    logo: electroLogo,
  },
  {
    id: '3',
    name: 'Lunar Fest',
    year: 2021,
    city: 'Rio de Janeiro',
    logo: lunarLogo,
  },
]

export const festivalMap: MapLocation[] = [
  { id: 'stageA', name: 'Palco A', type: 'stage', x: 20, y: 40 },
  { id: 'stageB', name: 'Palco B', type: 'stage', x: 70, y: 50 },
  {
    id: 'stageEletronico',
    name: 'Palco Eletrônico',
    type: 'stage',
    x: 45,
    y: 20,
  },
  { id: 'stageAlt', name: 'Palco Alternativo', type: 'stage', x: 40, y: 75 },
  { id: 'food', name: 'Food Trucks', type: 'food', x: 40, y: 70 },
  { id: 'bathroom', name: 'Banheiros', type: 'bathroom', x: 60, y: 20 },
  { id: 'merch', name: 'Merch Oficial', type: 'shop', x: 15, y: 60 },
]

export function getArtistById(artistId: string) {
  return artists.find((artist) => artist.id === artistId) ?? null
}

export function getStageById(stageId: string) {
  return stages.find((stage) => stage.id === stageId) ?? null
}

export function getActiveBatch(ticket: TicketCategory) {
  return (
    ticket.batches.find((batch) => batch.remaining > 0) ??
    ticket.batches[0] ??
    null
  )
}
