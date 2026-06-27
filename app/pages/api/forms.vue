<script setup lang="ts">
import { useWeightFitSchema } from '~/composables/useWeightFit'

usePageSeo({
  title: 'Form Schemas - Weight 2 FIT',
  description: 'Machine-readable form schemas for AI agents and LLMs. Access structured definitions of weight scale metrics and form validation rules.',
  ogDescription: 'Form schemas for AI integration. Discover weight scale form structure, validation rules, and field metadata.'
})

const schema = useWeightFitSchema()
</script>

<template>
  <div>
    <UPageHero
      title="Form Schemas"
      description="Machine-readable form definitions for AI agents and LLMs. These schemas describe the structure of our forms, validation rules, and acceptable input values."
    />

    <div class="max-w-4xl mx-auto space-y-8 p-6">
      <!-- Overview Section -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Available Forms
          </h2>
        </template>
        <div class="space-y-4">
          <p>
            This page provides machine-readable schemas for AI agents, language models, and developer tools.
            Each form is documented with:
          </p>
          <ul class="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Complete field definitions with types and constraints</li>
            <li>Validation rules (min/max values, required fields)</li>
            <li>Unit information for numeric fields</li>
            <li>Example values to aid understanding</li>
            <li>Field descriptions explaining purpose and usage</li>
          </ul>
        </div>
      </UCard>

      <!-- Weight Scale Form Schema -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ schema.title }}
          </h2>
        </template>

        <div class="space-y-6">
          <!-- Description -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ schema.description }}
            </p>
          </div>

          <!-- Sections Overview -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Form Sections
            </h3>
            <div class="space-y-2">
              <div
                v-for="section in schema.sections"
                :key="section.id"
                class="p-3 border border-gray-200 dark:border-gray-700 rounded"
              >
                <h4 class="font-medium text-sm">
                  {{ section.title }}
                </h4>
                <p
                  v-if="section.description"
                  class="text-xs text-gray-600 dark:text-gray-400 mt-1"
                >
                  {{ section.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Fields Documentation -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Fields
            </h3>
            <div class="space-y-4">
              <div
                v-for="field in schema.fields"
                :key="field.name"
                class="border border-gray-200 dark:border-gray-700 rounded p-4 space-y-2"
              >
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h4 class="font-mono text-sm font-semibold text-primary">
                      {{ field.name }}
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ field.label }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end gap-1 text-xs">
                    <span
                      v-if="field.required"
                      class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded"
                    >
                      Required
                    </span>
                    <span class="text-gray-500">
                      {{ field.type }}
                    </span>
                  </div>
                </div>

                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ field.description }}
                </p>

                <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div v-if="field.unit" class="col-span-1">
                    <span class="font-semibold">Unit:</span> {{ field.unit }}
                  </div>
                  <div v-if="field.example !== undefined" class="col-span-1">
                    <span class="font-semibold">Example:</span> {{ field.example }}
                  </div>
                  <div v-if="field.minimum !== undefined" class="col-span-1">
                    <span class="font-semibold">Min:</span>
                    <span v-if="field.exclusiveMinimum"> &gt; {{ field.minimum }}</span>
                    <span v-else> ≥ {{ field.minimum }}</span>
                  </div>
                  <div v-if="field.maximum !== undefined" class="col-span-1">
                    <span class="font-semibold">Max:</span>
                    <span v-if="field.exclusiveMaximum"> &lt; {{ field.maximum }}</span>
                    <span v-else> ≤ {{ field.maximum }}</span>
                  </div>
                  <div v-if="field.step !== undefined" class="col-span-2">
                    <span class="font-semibold">Step:</span> {{ field.step }}
                  </div>
                </div>

                <div class="text-xs text-gray-500">
                  Section: <span class="font-mono">{{ field.section }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Machine-Readable Schema -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Machine-Readable Schema
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
              JSON Schema Draft 7 format available at:
            </p>
            <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs overflow-x-auto">
              <a
                href="/weight-form-schema.json"
                class="text-primary hover:underline"
              >
                /weight-form-schema.json
              </a>
            </div>
          </div>

          <!-- Usage Instructions -->
          <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-4">
            <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              For AI Agents and LLMs
            </h3>
            <p class="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Use these schemas to:
            </p>
            <ul class="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside space-y-1">
              <li>Understand form structure and valid fields</li>
              <li>Validate user input before submission</li>
              <li>Generate accurate form completions</li>
              <li>Assist users in filling out forms correctly</li>
              <li>Generate test data matching form constraints</li>
            </ul>
          </div>
        </div>
      </UCard>

      <!-- Technical Details -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Technical Details
          </h2>
        </template>

        <div class="space-y-4 text-sm">
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Schema Version
            </h3>
            <p class="text-gray-600 dark:text-gray-400 font-mono">
              {{ schema.version }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Form ID
            </h3>
            <p class="text-gray-600 dark:text-gray-400 font-mono">
              {{ schema.formId }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Required Fields
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ schema.fields.filter(f => f.required).map(f => f.name).join(', ') }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Optional Fields
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-xs">
              {{ schema.fields.filter(f => !f.required).map(f => f.name).join(', ') }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Integration Info -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            API Integration
          </h2>
        </template>

        <div class="space-y-4 text-sm">
          <p class="text-gray-700 dark:text-gray-300">
            This page is automatically discovered by AI agents and LLMs via:
          </p>
          <ul class="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
            <li>
              <strong>llms.txt:</strong> Nuxt AI-Ready automatically includes this page in the
              <code class="bg-gray-100 dark:bg-gray-900 px-1 rounded">/llms.txt</code>
              and
              <code class="bg-gray-100 dark:bg-gray-900 px-1 rounded">/llms-full.txt</code>
              files
            </li>
            <li>
              <strong>Markdown export:</strong> This page can be fetched as markdown at
              <code class="bg-gray-100 dark:bg-gray-900 px-1 rounded">/api/forms.md</code>
            </li>
            <li>
              <strong>JSON Schema:</strong> Machine-readable schema at
              <code class="bg-gray-100 dark:bg-gray-900 px-1 rounded">/weight-form-schema.json</code>
            </li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>
