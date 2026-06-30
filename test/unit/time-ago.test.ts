import { describe, expect, it } from 'vitest'
import { formatTimeAgo } from '../../app/utils/time-ago'

describe('formatTimeAgo', () => {
  it('returns "just now" for less than 5 seconds', () => {
    const now = new Date()
    expect(formatTimeAgo(now)).toBe('just now')
  })

  it('returns "just now" for a few seconds ago', () => {
    const date = new Date(Date.now() - 3000)
    expect(formatTimeAgo(date)).toBe('just now')
  })

  it('returns "X seconds ago" for under a minute', () => {
    const date = new Date(Date.now() - 30000)
    expect(formatTimeAgo(date)).toBe('30 seconds ago')
  })

  it('returns "1 minute ago" for exactly 1 minute', () => {
    const date = new Date(Date.now() - 60000)
    expect(formatTimeAgo(date)).toBe('1 minute ago')
  })

  it('returns "X minutes ago" for under an hour', () => {
    const date = new Date(Date.now() - 300000)
    expect(formatTimeAgo(date)).toBe('5 minutes ago')
  })

  it('returns "1 hour ago" for exactly 1 hour', () => {
    const date = new Date(Date.now() - 3600000)
    expect(formatTimeAgo(date)).toBe('1 hour ago')
  })

  it('returns "X hours ago" for under a day', () => {
    const date = new Date(Date.now() - 7200000)
    expect(formatTimeAgo(date)).toBe('2 hours ago')
  })

  it('returns "1 day ago" for exactly 1 day', () => {
    const date = new Date(Date.now() - 86400000)
    expect(formatTimeAgo(date)).toBe('1 day ago')
  })

  it('returns "X days ago" for under a month', () => {
    const date = new Date(Date.now() - 432000000)
    expect(formatTimeAgo(date)).toBe('5 days ago')
  })

  it('returns "1 month ago" for approximately 1 month', () => {
    const date = new Date(Date.now() - 2592000000)
    expect(formatTimeAgo(date)).toBe('1 month ago')
  })

  it('returns "X months ago" for under a year', () => {
    const date = new Date(Date.now() - 7776000000)
    expect(formatTimeAgo(date)).toBe('3 months ago')
  })

  it('returns "1 year ago" for approximately 1 year', () => {
    const date = new Date(Date.now() - 31536000000)
    expect(formatTimeAgo(date)).toBe('1 year ago')
  })

  it('returns "X years ago" for multiple years', () => {
    const date = new Date(Date.now() - 63072000000)
    expect(formatTimeAgo(date)).toBe('2 years ago')
  })

  it('returns "just now" for a future date', () => {
    const date = new Date(Date.now() + 3600000)
    expect(formatTimeAgo(date)).toBe('just now')
  })

  it('handles ISO string input', () => {
    const date = new Date(Date.now() - 120000)
    expect(formatTimeAgo(date.toISOString())).toBe('2 minutes ago')
  })

  it('returns "just now" for 0 seconds difference', () => {
    const date = new Date(Date.now())
    expect(formatTimeAgo(date)).toBe('just now')
  })
})
