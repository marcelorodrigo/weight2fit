export function getFitFilename(date: Date = new Date()): string {
  return `weight-${date.toISOString().replace(/[:]/g, '-').slice(0, 19)}.fit`
}
