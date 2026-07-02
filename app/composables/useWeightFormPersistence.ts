import { useLocalStorage } from '@vueuse/core'
import type { WeightFormState } from '~/composables/useWeightFit'

interface SavedWeightEntry {
  data: WeightFormState
  savedAt: string
}

const STORAGE_KEY = 'weight-form-data'

export function useWeightFormPersistence() {
  const savedEntry = useLocalStorage<SavedWeightEntry | null>(STORAGE_KEY, null)

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
