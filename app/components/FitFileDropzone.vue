<script setup lang="ts">
interface Props {
  disabled?: boolean
}

interface Emits {
  'file-selected': [file: File]
  'error': [message: string]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const MAX_FILE_SIZE = 10 * 1024 * 1024

function validateFile(file: File): string | null {
  if (file.size === 0) return 'The selected file is empty.'
  if (file.size > MAX_FILE_SIZE) {
    return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds 10MB limit.`
  }
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension !== 'fit') return 'Please select a .fit file.'
  return null
}

function handleFileSelect(file: File) {
  if (props.disabled) return
  const error = validateFile(file)
  if (error) {
    emit('error', error)
    return
  }
  emit('file-selected', file)
}

function onFileChange(event: Event) {
  if (props.disabled) return
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  handleFileSelect(file)
  input.value = ''
}

function onDragOver(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

function onDragLeave(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false

  if (event.dataTransfer?.files.length) {
    const file = event.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }
}

function triggerFileInput() {
  if (props.disabled) return
  fileInputRef.value?.click()
}
</script>

<template>
  <UCard
    :class="[
      'relative border-2 transition-colors duration-200',
      isDragging ? 'border-primary bg-primary/5' : 'border-default hover:border-primary/50',
      props.disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
    ]"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="triggerFileInput"
  >
    <label
      for="fit-file-input"
      class="sr-only"
    >
      Upload a FIT file
    </label>

    <input
      id="fit-file-input"
      ref="fileInputRef"
      type="file"
      accept=".fit"
      :disabled="props.disabled"
      class="absolute inset-0 opacity-0"
      :class="props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
      @change="onFileChange"
      @click.stop
    >

    <div class="py-8 text-center sm:py-12">
      <UIcon
        v-if="!isDragging"
        name="i-lucide-upload-cloud"
        class="mx-auto mb-4 text-5xl text-muted sm:text-6xl"
      />
      <UIcon
        v-else
        name="i-lucide-download"
        class="mx-auto mb-4 text-5xl text-primary animate-bounce sm:text-6xl"
      />

      <h3 class="mb-2 text-lg font-medium text-highlighted">
        <template v-if="isDragging">
          Drop .fit file here
        </template>
        <template v-else>
          <span class="sm:hidden">Choose a .fit file</span>
          <span class="hidden sm:inline">Drag & drop a .fit file here</span>
        </template>
      </h3>

      <p class="mb-4 text-sm text-muted">
        <template v-if="isDragging">
          Release to upload
        </template>
        <template v-else>
          <span class="sm:hidden">Tap anywhere to browse your files</span>
          <span class="hidden sm:inline">or click to browse</span>
        </template>
      </p>

      <p class="text-xs text-muted">
        Maximum file size: 10MB • Only .fit files accepted
      </p>
    </div>
  </UCard>
</template>
