import { describe, expect, it, vi, afterEach } from 'vitest'
import { isEntryStale } from '../../app/utils/stale-entry'

describe('isEntryStale', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when savedAt is within the threshold', () => {
    const recent = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    expect(isEntryStale(recent, 15)).toBe(false)
  })

  it('returns false when savedAt equals the threshold exactly', () => {
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
    const exactly15 = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    expect(isEntryStale(exactly15, 15)).toBe(false)
  })

  it('returns true when savedAt exceeds the threshold', () => {
    const sixteenDaysAgo = new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
    expect(isEntryStale(sixteenDaysAgo, 15)).toBe(true)
  })

  it('returns false for invalid savedAt', () => {
    expect(isEntryStale('not-a-date', 15)).toBe(false)
  })

  it('returns true when days is 0 and savedAt is in the past', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(isEntryStale(yesterday, 0)).toBe(true)
  })

  it('treats negative days as 0', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(isEntryStale(yesterday, -5)).toBe(true)
  })

  it('returns false when savedAt is in the future', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    expect(isEntryStale(future, 15)).toBe(false)
  })
})
