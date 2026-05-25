import type { Performance } from "../../store/adminStore"

/**
 * Tipos de retorno da validação
 */
export type ScheduleResult =
  | { ok: true }
  | { ok: false; reason: "STAGE_CONFLICT" | "ARTIST_CONFLICT" }

/**
 * Converte horário HH:mm para minutos
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

/**
 * Verifica se duas apresentações entram em conflito (usado se precisar isoladamente)
 */
export function hasScheduleConflict(
  a: Performance,
  b: Performance
): boolean {
  // se for palco diferente não há conflito
  if (a.stageId !== b.stageId) return false

  // se for dia diferente não há conflito
  if (a.day !== b.day) return false

  const startA = timeToMinutes(a.start)
  const endA = timeToMinutes(a.end)

  const startB = timeToMinutes(b.start)
  const endB = timeToMinutes(b.end)

  return !(endA <= startB || endB <= startA)
}

/**
 * Verifica se uma nova apresentação pode ser agendada
 */
export function canSchedulePerformance(
  newPerf: Performance,
  existing: Performance[]
): ScheduleResult {

  const newStart = timeToMinutes(newPerf.start)
  const newEnd = timeToMinutes(newPerf.end)

  const BUFFER = 10 // minutos entre shows no mesmo palco

  for (const p of existing) {
    const sameDay = p.day === newPerf.day

    const start = timeToMinutes(p.start)
    const end = timeToMinutes(p.end)

    // 🔥 1. Conflito no mesmo palco (com buffer)
    const sameStage = p.stageId === newPerf.stageId

    if (sameDay && sameStage) {
      const overlap =
        newStart < end + BUFFER && newEnd > start - BUFFER

      if (overlap) {
        return { ok: false, reason: "STAGE_CONFLICT" }
      }
    }

    // 🔥 2. Mesmo artista em dois shows ao mesmo tempo
    const sameArtist = p.artistId === newPerf.artistId

    if (sameDay && sameArtist) {
      const overlap = newStart < end && newEnd > start

      if (overlap) {
        return { ok: false, reason: "ARTIST_CONFLICT" }
      }
    }
  }

  return { ok: true }
}