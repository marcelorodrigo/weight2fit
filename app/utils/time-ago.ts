export function formatTimeAgo(date: Date | string): string {
  const now = Date.now()
  const past = typeof date === 'string' ? new Date(date).getTime() : date.getTime()
  if (isNaN(past)) {
    return 'just now'
  }
  const diffMs = now - past

  if (diffMs < 0) {
    return 'just now'
  }

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 5) {
    return 'just now'
  }

  if (seconds < 60) {
    return `${seconds} seconds ago`
  }

  if (minutes === 1) {
    return '1 minute ago'
  }

  if (minutes < 60) {
    return `${minutes} minutes ago`
  }

  if (hours === 1) {
    return '1 hour ago'
  }

  if (hours < 24) {
    return `${hours} hours ago`
  }

  if (days === 1) {
    return '1 day ago'
  }

  if (days < 30) {
    return `${days} days ago`
  }

  if (months === 1) {
    return '1 month ago'
  }

  if (months < 12) {
    return `${months} months ago`
  }

  if (years === 1) {
    return '1 year ago'
  }

  return `${years} years ago`
}
