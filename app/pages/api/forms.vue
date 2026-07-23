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

    <div class="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:space-y-8 sm:p-6">
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
          <ul class="list-inside list-disc space-y-2 text-sm text-muted">
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
            <h3 class="mb-2 text-sm font-semibold text-toned">
              Description
            </h3>
            <p class="text-sm text-muted">
              {{ schema.description }}
            </p>
          </div>

          <!-- Sections Overview -->
          <div>
            <h3 class="mb-3 text-sm font-semibold text-toned">
              Form Sections
            </h3>
            <div class="space-y-2">
              <div
                v-for="section in schema.sections"
                :key="section.id"
                class="rounded border border-default p-3"
              >
                <h4 class="font-medium text-sm">
                  {{ section.title }}
                </h4>
                <p
                  v-if="section.description"
                  class="mt-1 text-xs text-muted"
                >
                  {{ section.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Fields Documentation -->
          <div>
            <h3 class="mb-3 text-sm font-semibold text-toned">
              Fields
            </h3>
            <div class="space-y-4">
              <div
                v-for="field in schema.fields"
                :key="field.name"
                class="space-y-2 rounded border border-default p-4"
              >
                <div class="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
                  <div>
                    <h4 class="font-mono text-sm font-semibold text-primary">
                      {{ field.name }}
                    </h4>
                    <p class="text-sm text-muted">
                      {{ field.label }}
                    </p>
                  </div>
                  <div class="flex flex-row items-center gap-2 text-xs sm:flex-col sm:items-end sm:gap-1">
                    <span
                      v-if="field.required"
                      class="rounded bg-error/10 px-2 py-1 text-error"
                    >
                      Required
                    </span>
                    <span class="text-dimmed">
                      {{ field.type }}
                    </span>
                  </div>
                </div>

                <p class="text-sm text-toned">
                  {{ field.description }}
                </p>

                <div class="grid grid-cols-1 gap-2 text-xs text-muted sm:grid-cols-2">
                  <div
                    v-if="field.unit"
                    class="col-span-1"
                  >
                    <span class="font-semibold">Unit:</span> {{ field.unit }}
                  </div>
                  <div
                    v-if="field.example !== undefined"
                    class="col-span-1"
                  >
                    <span class="font-semibold">Example:</span> {{ field.example }}
                  </div>
                  <div
                    v-if="field.minimum !== undefined"
                    class="col-span-1"
                  >
                    <span class="font-semibold">Min:</span>
                    <span> ≥ {{ field.minimum }}</span>
                  </div>
                  <div
                    v-if="field.exclusiveMinimum !== undefined"
                    class="col-span-1"
                  >
                    <span class="font-semibold">Exclusive Min:</span>
                    <span> &gt; {{ field.exclusiveMinimum }}</span>
                  </div>
                  <div
                    v-if="field.maximum !== undefined"
                    class="col-span-1"
                  >
                    <span class="font-semibold">Max:</span>
                    <span> ≤ {{ field.maximum }}</span>
                  </div>
                  <div
                    v-if="field.exclusiveMaximum !== undefined"
                    class="col-span-1"
                  >
                    <span class="font-semibold">Exclusive Max:</span>
                    <span> &lt; {{ field.exclusiveMaximum }}</span>
                  </div>
                  <div
                    v-if="field.multipleOf !== undefined"
                    class="col-span-2"
                  >
                    <span class="font-semibold">Multiple of:</span> {{ field.multipleOf }}
                  </div>
                </div>

                <div class="break-words text-xs text-dimmed">
                  Section: <span class="font-mono">{{ field.section }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Machine-Readable Schema -->
          <div>
            <h3 class="mb-2 text-sm font-semibold text-toned">
              Machine-Readable Schema
            </h3>
            <p class="mb-3 text-xs text-muted">
              JSON Schema Draft 7 format available at:
            </p>
            <div class="overflow-x-auto rounded border border-default bg-muted p-3 font-mono text-xs">
              <a
                href="/weight-form-schema.json"
                class="text-primary hover:underline"
              >
                /weight-form-schema.json
              </a>
            </div>
          </div>

          <!-- Usage Instructions -->
          <div class="rounded border border-info/25 bg-info/10 p-4">
            <h3 class="mb-2 text-sm font-semibold text-info">
              For AI Agents and LLMs
            </h3>
            <p class="mb-2 text-sm text-toned">
              Use these schemas to:
            </p>
            <ul class="list-inside list-disc space-y-1 text-sm text-toned">
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
            <h3 class="mb-1 font-semibold text-toned">
              Schema Version
            </h3>
            <p class="break-words font-mono text-muted">
              {{ schema.version }}
            </p>
          </div>
          <div>
            <h3 class="mb-1 font-semibold text-toned">
              Form ID
            </h3>
            <p class="break-words font-mono text-muted">
              {{ schema.formId }}
            </p>
          </div>
          <div>
            <h3 class="mb-1 font-semibold text-toned">
              Required Fields
            </h3>
            <p class="break-words text-muted">
              {{ schema.fields.filter(f => f.required).map(f => f.name).join(', ') }}
            </p>
          </div>
          <div>
            <h3 class="mb-1 font-semibold text-toned">
              Optional Fields
            </h3>
            <p class="break-words text-xs text-muted">
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
          <p class="text-toned">
            This page is automatically discovered by AI agents and LLMs via:
          </p>
          <ul class="list-inside list-disc space-y-2 text-muted">
            <li>
              <strong>llms.txt:</strong> Nuxt AI-Ready automatically includes this page in the
              <code class="rounded bg-elevated px-1">/llms.txt</code>
              and
              <code class="rounded bg-elevated px-1">/llms-full.txt</code>
              files
            </li>
            <li>
              <strong>Markdown export:</strong> This page can be fetched as markdown at
              <code class="rounded bg-elevated px-1">/api/forms.md</code>
            </li>
            <li>
              <strong>JSON Schema:</strong> Machine-readable schema at
              <code class="rounded bg-elevated px-1">/weight-form-schema.json</code>
            </li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>
