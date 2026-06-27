<script setup lang="ts">
usePageSeo({
  title: 'Body Composition Metrics Guide - Weight 2 FIT',
  description: 'Learn about all body composition metrics in Weight 2 FIT: weight, BMI, body fat %, muscle mass, metabolic rate, visceral fat, and more. Understand what each measurement means.',
  ogDescription: 'Comprehensive guide to body composition fields: weight, body fat %, hydration, muscle mass, basal metabolic rate, and other fitness metrics.'
})

const fields = [
  {
    name: 'Weight',
    description: 'Your body weight in kilograms. The foundation of body composition tracking.'
  },
  {
    name: 'BMI',
    description: 'Body Mass Index. A measure of body fat based on height and weight. Calculated as weight (kg) / height² (m²).'
  },
  {
    name: 'Body Fat %',
    description: 'The percentage of your total body weight that is fat. Typical ranges vary by age and sex.'
  },
  {
    name: 'Hydration %',
    description: 'The percentage of your body weight that is water. Typically ranges from 50-70%.'
  },
  {
    name: 'Visceral Fat Mass',
    description: 'The amount of deep body fat (in kg) surrounding your organs. Lower levels are healthier.'
  },
  {
    name: 'Bone Mass',
    description: 'The weight of your bones and minerals (in kg). Important for tracking skeletal health.'
  },
  {
    name: 'Muscle Mass',
    description: 'The total weight of your muscles (in kg). Increasing muscle mass improves metabolism.'
  },
  {
    name: 'Basal Metabolic Rate (BMR)',
    description: 'The number of calories your body burns at rest (in kcal/day). Used to estimate daily calorie needs.'
  },
  {
    name: 'Active Metabolic Rate (AMR)',
    description: 'The number of calories your body burns with activity (in kcal/day). Varies based on exercise level.'
  },
  {
    name: 'Metabolic Age',
    description: 'Your body\'s age based on metabolism compared to average. Lower is better.'
  },
  {
    name: 'Physique Rating',
    description: 'A subjective scale (1–9) rating your overall body composition. 1 = Obese, 9 = Very Lean.'
  },
  {
    name: 'Visceral Fat Rating',
    description: 'A scale (1–9) indicating your visceral (deep) body fat level. Lower is healthier.'
  }
]
</script>

<template>
  <div>
    <UPageHero
      title="Body Composition Fields"
      description="Learn what each metric in the Weight Scale FIT Generator means and how it helps track your fitness progress."
    />

    <UPageSection class="max-w-4xl">
      <div class="space-y-4">
        <UCard
          v-for="field in fields"
          :key="field.name"
          class="border-l-4"
          :style="{ borderLeftColor: 'var(--ui-primary)' }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-lg text-(--ui-primary)">
                {{ field.name }}
              </h3>
              <p class="text-sm text-(--ui-text-muted) mt-1">
                {{ field.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UPageSection>
  </div>
</template>
