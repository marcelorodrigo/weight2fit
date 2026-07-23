export function getFitFilename(date: Date = new Date()): string {
  return `weight-${date.toISOString().replaceAll(':', '-').slice(0, 19)}.fit`
}
