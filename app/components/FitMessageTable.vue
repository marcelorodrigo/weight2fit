<script setup lang="ts">
import type { FitMessage } from '~/composables/useFitViewer'

interface Props {
  messages: FitMessage[]
  messageType: string
}

const props = defineProps<Props>()

const fieldNames = computed(() => {
  const names = new Set<string>()
  let hasTimestamp = false
  for (const msg of props.messages) {
    for (const field of msg.fields) {
      names.add(field.name)
    }
    if (msg.timestamp) hasTimestamp = true
    if (msg.developerFields) {
      for (const key of Object.keys(msg.developerFields)) {
        names.add(key)
      }
    }
  }
  const ordered = [...names]
  if (hasTimestamp) ordered.unshift('timestamp')
  return ordered
})

const fieldHeaders = computed(() => {
  const map = new Map<string, string>()
  let hasTimestamp = false
  for (const msg of props.messages) {
    for (const field of msg.fields) {
      if (!map.has(field.name)) {
        map.set(field.name, field.unit ? `${field.name} (${field.unit})` : field.name)
      }
    }
    if (msg.timestamp) hasTimestamp = true
    if (msg.developerFields) {
      for (const key of Object.keys(msg.developerFields)) {
        if (!map.has(key)) map.set(key, key)
      }
    }
  }
  if (hasTimestamp) map.set('timestamp', 'Timestamp')
  return map
})

const columns = computed(() => {
  return fieldNames.value.map(name => ({
    accessorKey: name,
    header: fieldHeaders.value.get(name) ?? name
  }))
})

const data = computed(() => {
  return props.messages.map((msg) => {
    const row: Record<string, string> = {}
    if (msg.timestamp) {
      row.timestamp = formatCellValue(msg.timestamp)
    }
    for (const field of msg.fields) {
      row[field.name] = formatCellValue(field.value)
    }
    if (msg.developerFields) {
      for (const [key, value] of Object.entries(msg.developerFields)) {
        row[key] = formatCellValue(value)
      }
    }
    return row
  })
})

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'bigint') return `${value}n`
  if (value instanceof Date) return value.toLocaleString()
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    if (value.length <= 3) return value.map(v => formatCellValue(v)).join(', ')
    return `${value.slice(0, 3).map(v => formatCellValue(v)).join(', ')}, ...`
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<template>
  <div class="min-w-0 space-y-3">
    <h4 class="font-medium text-highlighted capitalize">
      {{ messageType }}
    </h4>

    <p
      v-if="columns.length > 1"
      class="flex items-center gap-1.5 text-xs text-muted sm:hidden"
    >
      <UIcon
        name="i-lucide-move-horizontal"
        class="size-4 shrink-0"
      />
      Swipe horizontally to see all fields
    </p>

    <UTable
      :columns="columns"
      :data="data"
      :striped="true"
      :caption="`${messageType} messages`"
      class="max-w-full"
      :ui="{
        th: 'px-3 py-3 sm:px-4 sm:py-3.5',
        td: 'px-3 py-3 sm:p-4'
      }"
    >
      <template #empty>
        <div class="py-8 text-center text-muted">
          No fields in this message type
        </div>
      </template>
    </UTable>
  </div>
</template>
