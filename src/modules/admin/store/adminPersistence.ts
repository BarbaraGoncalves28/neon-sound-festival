import { artists as festivalArtists } from '../../../data/festivalData'
import type { Artist, Performance, Stage } from './adminStore'

export const ADMIN_ARTISTS_STORAGE_KEY = 'neonSoundFestival.admin.artists'
export const ADMIN_STAGES_STORAGE_KEY = 'neonSoundFestival.admin.stages'
export const ADMIN_PERFORMANCES_STORAGE_KEY =
  'neonSoundFestival.admin.performances'
export const ADMIN_DATA_UPDATED_EVENT = 'neon-sound-festival:admin-data-updated'

const defaultArtists: Artist[] = festivalArtists.map((artist) => ({
  id: artist.id,
  name: artist.name,
  genre: artist.genre,
  day: artist.day,
  headliner: artist.headliner ?? false,
  openingsinger: artist.opening ?? false,
  newWave: false,
}))

const defaultStages: Stage[] = [
  {
    id: 's1',
    name: 'Palco Flow',
    capacity: 3000,
    type: 'newWave',
  },
  {
    id: 's2',
    name: 'Palco Next',
    capacity: 4000,
    type: 'newWave',
  },
  {
    id: 's3',
    name: 'Palco Prime',
    capacity: 8000,
    type: 'newWave',
  },
  {
    id: 's4',
    name: 'Palco A',
    capacity: 100000,
    type: 'main',
  },
  {
    id: 's5',
    name: 'Palco B',
    capacity: 60000,
    type: 'main',
  },
  {
    id: 's6',
    name: 'Palco Eletrônico',
    capacity: 40000,
    type: 'main',
  },
  {
    id: 's7',
    name: 'Palco Alternativo',
    capacity: 20000,
    type: 'main',
  },
]

const defaultPerformances: Performance[] = []

function cloneItems<T extends Record<string, unknown>>(items: T[]) {
  return items.map((item) => ({ ...item }))
}

function canUseStorage() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  )
}

function readStorageArray<T extends Record<string, unknown>>(
  key: string,
  fallback: T[],
) {
  if (!canUseStorage()) {
    return cloneItems(fallback)
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return cloneItems(fallback)
    }

    const parsedValue = JSON.parse(storedValue)

    if (!Array.isArray(parsedValue)) {
      return cloneItems(fallback)
    }

    return parsedValue as T[]
  } catch {
    return cloneItems(fallback)
  }
}

function notifyAdminDataUpdated(
  resource: 'artists' | 'stages' | 'performances',
) {
  if (!canUseStorage()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent(ADMIN_DATA_UPDATED_EVENT, {
      detail: { resource },
    }),
  )
}

export function getDefaultArtists() {
  return cloneItems(defaultArtists)
}

export function getStoredArtists() {
  return readStorageArray(ADMIN_ARTISTS_STORAGE_KEY, defaultArtists)
}

export function saveStoredArtists(artists: Artist[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(
      ADMIN_ARTISTS_STORAGE_KEY,
      JSON.stringify(artists),
    )
  }

  notifyAdminDataUpdated('artists')
}

export function getDefaultStages() {
  return cloneItems(defaultStages)
}

export function getStoredStages() {
  return readStorageArray(ADMIN_STAGES_STORAGE_KEY, defaultStages)
}

export function saveStoredStages(stages: Stage[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(
      ADMIN_STAGES_STORAGE_KEY,
      JSON.stringify(stages),
    )
  }

  notifyAdminDataUpdated('stages')
}

export function getStoredPerformances() {
  return readStorageArray(ADMIN_PERFORMANCES_STORAGE_KEY, defaultPerformances)
}

export function saveStoredPerformances(performances: Performance[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(
      ADMIN_PERFORMANCES_STORAGE_KEY,
      JSON.stringify(performances),
    )
  }

  notifyAdminDataUpdated('performances')
}
