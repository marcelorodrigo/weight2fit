import { describe, expect, it, vi, beforeEach } from 'vitest'

const store = vi.hoisted(() => {
  const mockRef = { value: null as Record<string, unknown> | null }
  return { mockRef }
})

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  const { ref } = await import('vue')
  store.mockRef = ref<Record<string, unknown> | null>(null)
  return {
    ...actual,
    useLocalStorage: vi.fn(() => store.mockRef)
  }
})

describe('useWeightFormPersistence', () => {
  beforeEach(() => {
    store.mockRef.value = null
  })

  it('starts with no saved data', () => {
    const { hasSavedData } = useWeightFormPersistence()
    expect(hasSavedData.value).toBe(false)
  })

  it('saves data and sets hasSavedData to true', () => {
    const { hasSavedData, save } = useWeightFormPersistence()

    save({ weight: 75.5, percentFat: 18.5 })

    expect(hasSavedData.value).toBe(true)
  })

  it('restores saved data', () => {
    const { save, restore } = useWeightFormPersistence()

    save({ weight: 75.5, percentFat: 18.5 })
    const data = restore()

    expect(data).toEqual({ weight: 75.5, percentFat: 18.5 })
  })

  it('clears saved data', () => {
    const { hasSavedData, save, clear } = useWeightFormPersistence()

    save({ weight: 75.5 })
    expect(hasSavedData.value).toBe(true)

    clear()
    expect(hasSavedData.value).toBe(false)
  })

  it('returns null from restore after clear', () => {
    const { save, restore, clear } = useWeightFormPersistence()

    save({ weight: 75.5 })
    clear()
    const data = restore()

    expect(data).toBeNull()
  })

  it('restores a copy of the data, not a reference', () => {
    const { save, restore } = useWeightFormPersistence()

    save({ weight: 75.5 })
    const data = restore()
    if (data) {
      data.weight = 80
    }

    const dataAgain = restore()
    expect(dataAgain?.weight).toBe(75.5)
  })

  it('persists across composable instances', () => {
    const { save } = useWeightFormPersistence()
    save({ weight: 75.5 })

    const { hasSavedData, restore } = useWeightFormPersistence()
    expect(hasSavedData.value).toBe(true)
    expect(restore()).toEqual({ weight: 75.5 })
  })

  it('stores a savedAt timestamp on save', () => {
    const { save, savedEntry } = useWeightFormPersistence()

    save({ weight: 75.5 })

    expect(savedEntry.value).not.toBeNull()
    expect(savedEntry.value?.savedAt).toBeDefined()
    expect(() => new Date(savedEntry.value!.savedAt)).not.toThrow()
  })

  it('saves optional fields', () => {
    const { save, restore } = useWeightFormPersistence()

    save({
      weight: 75.5,
      percentFat: 18.5,
      percentHydration: 55,
      visceralFatMass: 3.2,
      boneMass: 2.8,
      muscleMass: 35.0,
      basalMet: 1700,
      physiqueRating: 7,
      activeMet: 2100,
      metabolicAge: 30,
      visceralFatRating: 3,
      bmi: 23.5
    })

    const data = restore()
    expect(data).toEqual({
      weight: 75.5,
      percentFat: 18.5,
      percentHydration: 55,
      visceralFatMass: 3.2,
      boneMass: 2.8,
      muscleMass: 35.0,
      basalMet: 1700,
      physiqueRating: 7,
      activeMet: 2100,
      metabolicAge: 30,
      visceralFatRating: 3,
      bmi: 23.5
    })
  })
})
