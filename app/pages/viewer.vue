<script setup lang="ts">
usePageSeo({
  title: 'FIT File Viewer - Decode and Inspect FIT Files',
  description: 'Upload a FIT file to view its decoded contents. View all message types including records, sessions, laps, and device info in an organized tabbed interface.',
  ogDescription: 'Decode and inspect FIT files in your browser. View weight scale data, activity records, and device information.'
})

const { state, decode, clear, downloadJson } = useFitViewer()
const fileInputRef = ref<HTMLInputElement>()
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
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
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
        <span class="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
          FIT File Viewer
        </span>
      </template>
    </UPageHero>

    <UContainer class="py-8">
      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-(--ui-text)">
              Upload FIT File
            </h2>
            <UBadge
              v-if="state.file"
              color="success"
              size="sm"
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

        <div
          v-if="errorMessage"
          class="mt-4 p-4 bg-(--ui-negative)/10 border border-(--ui-negative)/20 rounded-lg text-(--ui-negative) text-sm"
        >
          <div class="flex items-start gap-2">
            <UIcon
              name="i-lucide-alert-circle"
              class="w-5 h-5 mt-0.5 shrink-0"
            />
            <span>{{ errorMessage }}</span>
          </div>
        </div>

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
          <p class="text-center text-sm text-(--ui-text-muted) mt-2">
            Decoding FIT file...
          </p>
        </div>

        <div
          v-if="state.error && !state.isLoading"
          class="mt-4 p-4 bg-(--ui-negative)/10 border border-(--ui-negative)/20 rounded-lg text-(--ui-negative) text-sm"
        >
          <div class="flex items-start gap-2">
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-5 h-5 mt-0.5 shrink-0"
            />
            <div>
              <p class="font-medium">
                {{ state.error.message }}
              </p>
              <p class="text-xs mt-1 opacity-75">
                Error code: {{ state.error.code }}
              </p>
            </div>
          </div>
          <UButton
            size="sm"
            variant="subtle"
            color="neutral"
            class="mt-3"
            @click="handleClear"
          >
            Clear & Try Again
          </UButton>
        </div>
      </UCard>

      <UCard v-if="state.result && !state.isLoading">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-(--ui-text)">
                Decoded FIT File
              </h2>
              <p class="text-sm text-(--ui-text-muted)">
                {{ state.result.messages.length }} messages • {{ state.result.messageTypes.length }} message types
                <span
                  v-if="state.result.profileVersion"
                  class="ml-4"
                >
                  • Profile v{{ state.result.profileVersion.major }}.{{ state.result.profileVersion.minor }}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <UButton
                size="sm"
                variant="subtle"
                color="neutral"
                icon="i-lucide-download"
                @click="downloadJson"
              >
                Download JSON
              </UButton>
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-rotate-ccw"
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
          <h2 class="text-lg font-semibold text-(--ui-text)">
            Supported File Types
          </h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-(--ui-bg-elevated) rounded-lg">
            <UIcon
              name="i-lucide-weight"
              class="w-8 h-8 text-primary mb-2"
            />
            <h3 class="font-medium text-(--ui-text) mb-1">
              Weight Scale
            </h3>
            <p class="text-sm text-(--ui-text-muted)">
              Body composition data: weight, body fat %, muscle mass, hydration, metabolic data
            </p>
          </div>
          <div class="p-4 bg-(--ui-bg-elevated) rounded-lg">
            <UIcon
              name="i-lucide-activity"
              class="w-8 h-8 text-green-500 mb-2"
            />
            <h3 class="font-medium text-(--ui-text) mb-1">
              Activity Records
            </h3>
            <p class="text-sm text-(--ui-text-muted)">
              Running, cycling, swimming data: GPS, heart rate, power, cadence, speed
            </p>
          </div>
          <div class="p-4 bg-(--ui-bg-elevated) rounded-lg">
            <UIcon
              name="i-lucide-cpu"
              class="w-8 h-8 text-purple-500 mb-2"
            />
            <h3 class="font-medium text-(--ui-text) mb-1">
              Device Info
            </h3>
            <p class="text-sm text-(--ui-text-muted)">
              Device information, settings, file metadata, developer fields
            </p>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
