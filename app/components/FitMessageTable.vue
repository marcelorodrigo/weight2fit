<script setup lang="ts">
import type { FitMessage } from '~/composables/useFitViewer'

interface Props {
  messages: FitMessage[]
  messageType: string
}

const props = defineProps<Props>()

const fieldNames = computed(() => {
  const names = new Set<string>()
  for (const msg of props.messages) {
    for (const field of msg.fields) {
      names.add(field.name)
    }
  }
  return [...names]
})

const fieldHeaders = computed(() => {
  const map = new Map<string, string>()
  for (const msg of props.messages) {
    for (const field of msg.fields) {
      if (!map.has(field.name)) {
        map.set(field.name, field.unit ? `${field.name} (${field.unit})` : field.name)
      }
    }
  }
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
    for (const field of msg.fields) {
      row[field.name] = formatCellValue(field.value)
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
  <div class="space-y-3">
    <h4 class="font-medium text-(--ui-text) capitalize">
      {{ messageType }}
    </h4>

    <UTable
      :columns="columns"
      :data="data"
      :striped="true"
      class="w-full"
    >
      <template #empty>
        <div class="text-center py-8 text-(--ui-text-muted)">
          No fields in this message type
        </div>
      </template>
    </UTable>
  </div>
</template>
