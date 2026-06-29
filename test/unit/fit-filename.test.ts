import { describe, expect, it } from 'vitest'
import { getFitFilename } from '../../app/utils/fit-filename'

describe('getFitFilename', () => {
  it('returns a filename matching the expected format', () => {
    const filename = getFitFilename(new Date('2026-06-29T14:30:15Z'))
    expect(filename).toBe('weight-2026-06-29T14-30-15.fit')
  })

  it('uses current date when called without arguments', () => {
    const now = new Date()
    const filename = getFitFilename()

    expect(filename).toMatch(/^weight-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.fit$/)

    const datePart = filename.slice(7, 26)
    const [date, time] = datePart.split('T')
    const [y, m, d] = date.split('-').map(Number)
    const [h, min, s] = time.split('-').map(Number)
    const parsed = new Date(Date.UTC(y, m - 1, d, h, min, s))

    expect(parsed.getTime()).toBeGreaterThanOrEqual(now.getTime() - 60000)
    expect(parsed.getTime()).toBeLessThanOrEqual(now.getTime() + 1000)
  })

  it('replaces colons with hyphens', () => {
    const filename = getFitFilename(new Date('2026-12-25T10:05:30Z'))
    expect(filename).toBe('weight-2026-12-25T10-05-30.fit')
  })

  it('excludes milliseconds from filename', () => {
    const filename = getFitFilename(new Date('2026-06-29T14:30:15.500Z'))
    expect(filename).toBe('weight-2026-06-29T14-30-15.fit')
  })

  it('ensures uniqueness for different times on the same day', () => {
    const file1 = getFitFilename(new Date('2026-06-29T09:00:00Z'))
    const file2 = getFitFilename(new Date('2026-06-29T17:30:45Z'))
    expect(file1).not.toBe(file2)
  })
})
