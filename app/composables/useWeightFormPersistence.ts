import { useLocalStorage } from '@vueuse/core'
import type { Serializer } from '@vueuse/core'
import type { WeightFormState } from '~/composables/useWeightFit'

interface SavedWeightEntry {
  data: WeightFormState
  savedAt: string
}

const STORAGE_KEY = 'weight-form-data'

const savedWeightEntrySerializer: Serializer<SavedWeightEntry | null> = {
  read(raw) {
    try {
      const value: unknown = JSON.parse(raw)

      if (!isSavedWeightEntry(value)) {
        return null
      }

      return value
    } catch {
      return null
    }
  },
  write(value) {
    return JSON.stringify(value) ?? 'null'
  }
}

function isSavedWeightEntry(value: unknown): value is SavedWeightEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const entry = value as Record<string, unknown>
  const data = entry.data

  return typeof data === 'object'
    && data !== null
    && typeof (data as Record<string, unknown>).weight === 'number'
    && typeof entry.savedAt === 'string'
}

export function useWeightFormPersistence() {
  const savedEntry = useLocalStorage<SavedWeightEntry | null>(STORAGE_KEY, null, {
    serializer: savedWeightEntrySerializer
  })

  const hasSavedData = computed(() => savedEntry.value?.data != null)

  function save(data: WeightFormState) {
    savedEntry.value = {
      data: { ...data },
      savedAt: new Date().toISOString()
    } as SavedWeightEntry
  }

  function restore(): WeightFormState | null {
    return savedEntry.value?.data ? { ...savedEntry.value.data } : null
  }

  function clear() {
    savedEntry.value = null
  }

  return {
    savedEntry,
    hasSavedData,
    save,
    restore,
    clear
  }
}
