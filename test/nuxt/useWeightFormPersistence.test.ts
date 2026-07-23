import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { effectScope, nextTick } from 'vue'
import type { EffectScope } from 'vue'
import { Window } from 'happy-dom'

const STORAGE_KEY = 'weight-form-data'
const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')

const testScopes: EffectScope[] = []
let storageWindow: Window

function createPersistence() {
  const scope = effectScope()
  testScopes.push(scope)
  return scope.run(() => useWeightFormPersistence())!
}

function stopPersistenceScopes() {
  for (const scope of testScopes) {
    scope.stop()
  }
  testScopes.length = 0
}

describe('useWeightFormPersistence', () => {
  beforeEach(() => {
    stopPersistenceScopes()
    storageWindow = new Window({ url: 'http://localhost' })
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storageWindow.localStorage
    })
    window.localStorage.clear()
  })

  afterEach(() => {
    stopPersistenceScopes()
    storageWindow.happyDOM.abort()

    if (originalLocalStorage) {
      Object.defineProperty(globalThis, 'localStorage', originalLocalStorage)
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage')
    }
  })

  it('starts with no saved data', () => {
    const { hasSavedData } = createPersistence()
    expect(hasSavedData.value).toBe(false)
  })

  it('saves data and sets hasSavedData to true', () => {
    const { hasSavedData, save } = createPersistence()

    save({ weight: 75.5, percentFat: 18.5 })

    expect(hasSavedData.value).toBe(true)
  })

  it('restores saved data', () => {
    const { save, restore } = createPersistence()

    save({ weight: 75.5, percentFat: 18.5 })
    const data = restore()

    expect(data).toEqual({ weight: 75.5, percentFat: 18.5 })
  })

  it('clears saved data', () => {
    const { hasSavedData, save, clear } = createPersistence()

    save({ weight: 75.5 })
    expect(hasSavedData.value).toBe(true)

    clear()
    expect(hasSavedData.value).toBe(false)
  })

  it('returns null from restore after clear', () => {
    const { save, restore, clear } = createPersistence()

    save({ weight: 75.5 })
    clear()
    const data = restore()

    expect(data).toBeNull()
  })

  it('restores a copy of the data, not a reference', () => {
    const { save, restore } = createPersistence()

    save({ weight: 75.5 })
    const data = restore()
    if (data) {
      data.weight = 80
    }

    const dataAgain = restore()
    expect(dataAgain?.weight).toBe(75.5)
  })

  it('stores JSON and restores it in a new composable instance', async () => {
    const { save } = createPersistence()
    save({ weight: 75.5 })
    await nextTick()

    const stored = window.localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored!)).toMatchObject({
      data: { weight: 75.5 }
    })

    stopPersistenceScopes()
    const { hasSavedData, restore } = createPersistence()
    expect(hasSavedData.value).toBe(true)
    expect(restore()).toEqual({ weight: 75.5 })
  })

  it('stores a savedAt timestamp on save', () => {
    const { save, savedEntry } = createPersistence()

    save({ weight: 75.5 })

    expect(savedEntry.value).not.toBeNull()
    expect(savedEntry.value?.savedAt).toBeDefined()
    expect(new Date(savedEntry.value!.savedAt).getTime()).not.toBeNaN()
  })

  it('saves optional fields', () => {
    const { save, restore } = createPersistence()

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

  it('ignores malformed legacy data and replaces it on the next save', async () => {
    window.localStorage.setItem(STORAGE_KEY, '[object Object]')

    const { hasSavedData, restore, save } = createPersistence()

    expect(hasSavedData.value).toBe(false)
    expect(restore()).toBeNull()

    save({ weight: 82.5 })
    await nextTick()

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({
      data: { weight: 82.5 }
    })
  })
})
