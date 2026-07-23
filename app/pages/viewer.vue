<script setup lang="ts">
usePageSeo({
  title: 'FIT File Viewer - Decode and Inspect FIT Files',
  description: 'Upload a FIT file to view its decoded contents. View all message types including records, sessions, laps, and device info in an organized tabbed interface.',
  ogDescription: 'Decode and inspect FIT files in your browser. View weight scale data, activity records, and device information.'
})

const { state, decode, clear, downloadJson } = useFitViewer()
const errorMessage = ref<string>('')

function handleFileSelect(file: File) {
  errorMessage.value = ''
  decode(file)
}

function handleError(message: string) {
  errorMessage.value = message
}

function handleClear() {
  clear()
  errorMessage.value = ''
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script>

<template>
  <div class="min-h-screen">
    <UPageHero
      title="FIT File Viewer"
      description="Upload a FIT file to view its decoded contents. Supports weight scale data, activity records, device info, and more."
      :links="[
        {
          label: 'Try Weight Tool',
          to: '/weight',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl'
        },
        {
          label: 'View on GitHub',
          to: 'https://github.com/marcelorodrigo/weight2fit',
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle'
        }
      ]"
    >
      <template #title>
        <span class="animate-shimmer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent bg-[length:200%_100%]">
          FIT File Viewer
        </span>
      </template>
    </UPageHero>

    <UContainer class="py-4 sm:py-8">
      <UCard class="mb-6">
        <template #header>
          <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-lg font-semibold text-highlighted">
              Upload FIT File
            </h2>
            <UBadge
              v-if="state.file"
              color="success"
              size="sm"
              class="max-w-full"
              :title="state.file.name"
              :ui="{ label: 'truncate' }"
            >
              {{ state.file.name }} ({{ formatBytes(state.file.size) }})
            </UBadge>
          </div>
        </template>

        <FitFileDropzone
          :disabled="state.isLoading"
          @file-selected="handleFileSelect"
          @error="handleError"
        />

        <UAlert
          v-if="errorMessage"
          icon="i-lucide-circle-alert"
          title="Unable to upload file"
          :description="errorMessage"
          color="error"
          variant="subtle"
          class="mt-4"
        />

        <div
          v-if="state.isLoading"
          class="mt-6"
        >
          <UProgress
            :value="50"
            :indeterminate="true"
            class="w-full"
            color="primary"
          />
          <p class="mt-2 text-center text-sm text-muted">
            Decoding FIT file...
          </p>
        </div>

        <UAlert
          v-if="state.error && !state.isLoading"
          icon="i-lucide-triangle-alert"
          :title="state.error.message"
          :description="`Error code: ${state.error.code}`"
          color="error"
          variant="subtle"
          orientation="vertical"
          :actions="[{
            label: 'Clear & Try Again',
            color: 'neutral',
            variant: 'subtle',
            onClick: handleClear
          }]"
          class="mt-4"
        />
      </UCard>

      <UCard v-if="state.result && !state.isLoading">
        <template #header>
          <div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <h2 class="text-lg font-semibold text-highlighted">
                Decoded FIT File
              </h2>
              <p class="flex flex-wrap gap-x-2 text-sm text-muted">
                <span>{{ state.result.messages.length }} messages</span>
                <span>• {{ state.result.messageTypes.length }} message types</span>
                <span
                  v-if="state.result.profileVersion"
                >
                  • Profile v{{ state.result.profileVersion.major }}.{{ state.result.profileVersion.minor }}
                </span>
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <UButton
                size="sm"
                variant="subtle"
                color="neutral"
                icon="i-lucide-download"
                class="min-h-11 justify-center"
                @click="downloadJson"
              >
                Download JSON
              </UButton>
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-rotate-ccw"
                class="min-h-11 justify-center"
                @click="handleClear"
              >
                Clear
              </UButton>
            </div>
          </div>
        </template>

        <FitMessageTabs :result="state.result" />
      </UCard>

      <UCard v-if="!state.file && !state.isLoading && !state.result">
        <template #header>
          <h2 class="text-lg font-semibold text-highlighted">
            Supported File Types
          </h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-lg bg-elevated p-4">
            <UIcon
              name="i-lucide-weight"
              class="mb-2 size-8 text-primary"
            />
            <h3 class="mb-1 font-medium text-highlighted">
              Weight Scale
            </h3>
            <p class="text-sm text-muted">
              Body composition data: weight, body fat %, muscle mass, hydration, metabolic data
            </p>
          </div>
          <div class="rounded-lg bg-elevated p-4">
            <UIcon
              name="i-lucide-activity"
              class="mb-2 size-8 text-success"
            />
            <h3 class="mb-1 font-medium text-highlighted">
              Activity Records
            </h3>
            <p class="text-sm text-muted">
              Running, cycling, swimming data: GPS, heart rate, power, cadence, speed
            </p>
          </div>
          <div class="rounded-lg bg-elevated p-4">
            <UIcon
              name="i-lucide-cpu"
              class="mb-2 size-8 text-secondary"
            />
            <h3 class="mb-1 font-medium text-highlighted">
              Device Info
            </h3>
            <p class="text-sm text-muted">
              Device information, settings, file metadata, developer fields
            </p>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
