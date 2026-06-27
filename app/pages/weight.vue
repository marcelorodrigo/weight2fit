<script setup lang="ts">
import type { WeightFormState } from '~/composables/useWeightFit'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const state = reactive<Partial<WeightFormState>>({})

function validate(state: Partial<WeightFormState>): FormError[] {
  const errors: FormError[] = []

  if (!state.weight || state.weight <= 0) {
    errors.push({ name: 'weight', message: 'Weight is required and must be greater than 0' })
  }

  if (state.percentFat !== undefined && (state.percentFat < 0 || state.percentFat > 100)) {
    errors.push({ name: 'percentFat', message: 'Body fat must be between 0 and 100' })
  }

  if (state.percentHydration !== undefined && (state.percentHydration < 0 || state.percentHydration > 100)) {
    errors.push({ name: 'percentHydration', message: 'Hydration must be between 0 and 100' })
  }

  if (state.visceralFatMass !== undefined && state.visceralFatMass < 0) {
    errors.push({ name: 'visceralFatMass', message: 'Visceral fat mass must be 0 or greater' })
  }

  if (state.boneMass !== undefined && state.boneMass < 0) {
    errors.push({ name: 'boneMass', message: 'Bone mass must be 0 or greater' })
  }

  if (state.muscleMass !== undefined && state.muscleMass < 0) {
    errors.push({ name: 'muscleMass', message: 'Muscle mass must be 0 or greater' })
  }

  if (state.basalMet !== undefined && state.basalMet < 0) {
    errors.push({ name: 'basalMet', message: 'BMR must be 0 or greater' })
  }

  if (state.physiqueRating !== undefined && (state.physiqueRating < 1 || state.physiqueRating > 9)) {
    errors.push({ name: 'physiqueRating', message: 'Physique rating must be between 1 and 9' })
  }

  if (state.activeMet !== undefined && state.activeMet < 0) {
    errors.push({ name: 'activeMet', message: 'Active MET must be 0 or greater' })
  }

  if (state.metabolicAge !== undefined && (state.metabolicAge < 1 || !Number.isInteger(state.metabolicAge))) {
    errors.push({ name: 'metabolicAge', message: 'Metabolic age must be a positive integer' })
  }

  if (state.visceralFatRating !== undefined && (state.visceralFatRating < 1 || state.visceralFatRating > 9)) {
    errors.push({ name: 'visceralFatRating', message: 'Visceral fat rating must be between 1 and 9' })
  }

  if (state.bmi !== undefined && state.bmi <= 0) {
    errors.push({ name: 'bmi', message: 'BMI must be greater than 0' })
  }

  return errors
}

function onSubmit(event: FormSubmitEvent<WeightFormState>) {
  try {
    const { encode } = useWeightFit()
    const bytes = encode(event.data)
    const blob = new Blob([bytes.slice().buffer], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weight-${new Date().toISOString().slice(0, 10)}.fit`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
    toast.add({ title: 'FIT file downloaded', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to generate FIT file', color: 'error' })
  }
}
</script>

<template>
  <div>
    <UPageHero
      title="Weight Scale FIT Generator"
      description="Generate a Weight Scale FIT file from body composition data. Fill in your metrics and download a .fit file ready to import into any device that supports FIT files."
    />

    <UForm
      :state="state"
      :validate="validate"
      class="max-w-2xl mx-auto space-y-6 p-6"
      @submit="onSubmit"
    >
      <UCard
        class="border-t-2"
        :style="{ borderTopColor: 'var(--ui-primary)' }"
      >
        <template #header>
          <h2 class="text-lg font-semibold text-(--ui-primary)">
            Basic
          </h2>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            name="weight"
            label="Weight"
            required
          >
            <UInputNumber
              v-model="state.weight"
              name="weight"
              :min="0"
              :step="0.1"
              placeholder="kg"
              required
            />
          </UFormField>

          <UFormField
            name="bmi"
            label="BMI"
            hint="kg/m²"
          >
            <UInputNumber
              v-model="state.bmi"
              name="bmi"
              :min="0"
              :step="0.1"
              placeholder="kg/m²"
            />
          </UFormField>
        </div>
      </UCard>

      <UCard
        class="border-t-2"
        :style="{ borderTopColor: 'var(--ui-primary)' }"
      >
        <template #header>
          <h2 class="text-lg font-semibold text-(--ui-primary)">
            Body Composition
          </h2>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            name="percentFat"
            label="Body Fat"
            hint="%"
          >
            <UInputNumber
              v-model="state.percentFat"
              name="percentFat"
              :min="0"
              :max="100"
              :step="0.1"
              placeholder="%"
            />
          </UFormField>

          <UFormField
            name="percentHydration"
            label="Hydration"
            hint="%"
          >
            <UInputNumber
              v-model="state.percentHydration"
              name="percentHydration"
              :min="0"
              :max="100"
              :step="0.1"
              placeholder="%"
            />
          </UFormField>

          <UFormField
            name="visceralFatMass"
            label="Visceral Fat Mass"
            hint="kg"
          >
            <UInputNumber
              v-model="state.visceralFatMass"
              name="visceralFatMass"
              :min="0"
              :step="0.1"
              placeholder="kg"
            />
          </UFormField>

          <UFormField
            name="boneMass"
            label="Bone Mass"
            hint="kg"
          >
            <UInputNumber
              v-model="state.boneMass"
              name="boneMass"
              :min="0"
              :step="0.1"
              placeholder="kg"
            />
          </UFormField>

          <UFormField
            name="muscleMass"
            label="Muscle Mass"
            hint="kg"
          >
            <UInputNumber
              v-model="state.muscleMass"
              name="muscleMass"
              :min="0"
              :step="0.1"
              placeholder="kg"
            />
          </UFormField>
        </div>
      </UCard>

      <UCard
        class="border-t-2"
        :style="{ borderTopColor: 'var(--ui-primary)' }"
      >
        <template #header>
          <h2 class="text-lg font-semibold text-(--ui-primary)">
            Metabolic
          </h2>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            name="basalMet"
            label="Basal Metabolic Rate"
            hint="kcal/day"
          >
            <UInputNumber
              v-model="state.basalMet"
              name="basalMet"
              :min="0"
              :step="1"
              placeholder="kcal/day"
            />
          </UFormField>

          <UFormField
            name="activeMet"
            label="Active Metabolic Rate"
            hint="kcal/day"
          >
            <UInputNumber
              v-model="state.activeMet"
              name="activeMet"
              :min="0"
              :step="1"
              placeholder="kcal/day"
            />
          </UFormField>

          <UFormField
            name="metabolicAge"
            label="Metabolic Age"
            hint="years"
          >
            <UInputNumber
              v-model="state.metabolicAge"
              name="metabolicAge"
              :min="1"
              :step="1"
              placeholder="years"
            />
          </UFormField>
        </div>
      </UCard>

      <UCard
        class="border-t-2"
        :style="{ borderTopColor: 'var(--ui-primary)' }"
      >
        <template #header>
          <h2 class="text-lg font-semibold text-(--ui-primary)">
            Ratings
          </h2>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            name="physiqueRating"
            label="Physique Rating"
            hint="1 (Obese) to 9 (Very lean)"
          >
            <UInputNumber
              v-model="state.physiqueRating"
              name="physiqueRating"
              :min="1"
              :max="9"
              :step="1"
              placeholder="1–9"
            />
          </UFormField>

          <UFormField
            name="visceralFatRating"
            label="Visceral Fat Rating"
            hint="1–9"
          >
            <UInputNumber
              v-model="state.visceralFatRating"
              name="visceralFatRating"
              :min="1"
              :max="9"
              :step="1"
              placeholder="1–9"
            />
          </UFormField>
        </div>
      </UCard>

      <div class="flex justify-end pt-4">
        <UButton
          type="submit"
          size="xl"
          icon="i-lucide-download"
        >
          Generate FIT File
        </UButton>
      </div>
    </UForm>
  </div>
</template>
