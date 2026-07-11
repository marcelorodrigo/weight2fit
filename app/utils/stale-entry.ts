export function isEntryStale(savedAt: string, days: number): boolean {
  if (typeof days !== 'number' || !Number.isFinite(days)) {
    return false
  }
  const now = Date.now()
  const past = new Date(savedAt).getTime()
  if (Number.isNaN(past)) {
    return false
  }
  const diffMs = now - past
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > Math.max(0, days)
}
