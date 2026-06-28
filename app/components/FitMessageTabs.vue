<script setup lang="ts">
import FitMessageTable from './FitMessageTable.vue'
import type { FitMessage, FitDecodeResult } from '~/composables/useFitViewer'

interface Props {
  result: FitDecodeResult | null
}

const props = defineProps<Props>()

interface TabItem {
  value: string
  label: string
  count: number
  messages: FitMessage[]
  typeName: string
}

const messagesByType = computed(() => {
  const map = new Map<string, FitMessage[]>()
  if (!props.result) return map
  for (const msg of props.result.messages) {
    const list = map.get(msg.typeKey)
    if (list) list.push(msg)
    else map.set(msg.typeKey, [msg])
  }
  return map
})

const messageGroups = computed(() => {
  if (!props.result) return []

  return props.result.messageTypes.map((typeKey) => {
    const messages = messagesByType.value.get(typeKey) ?? []
    return {
      value: typeKey,
      label: formatTypeName(typeKey),
      typeKey,
      typeName: messages[0]?.type || typeKey,
      count: messages.length,
      messages
    }
  }).filter(g => g.count > 0)
})

const activeTab = ref<string | undefined>(undefined)

watch(messageGroups, (groups) => {
  if (groups.length > 0 && activeTab.value === undefined) {
    const first = groups[0]
    if (first) activeTab.value = first.value
  }
}, { immediate: true })

function formatTypeName(typeKey: string): string {
  return typeKey
    .replace(/Mesgs?$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim()
}

function getTabContent(value: string): TabItem | undefined {
  return messageGroups.value.find(g => g.value === value)
}
</script>

<template>
  <div
    v-if="messageGroups.length > 0"
    class="space-y-4"
  >
    <UTabs
      v-model="activeTab"
      :items="messageGroups.map(g => ({
        label: `${g.label} (${g.count})`,
        value: g.value,
        slot: 'tab'
      }))"
      class="w-full"
    >
      <template #default="{ item }">
        <FitMessageTable
          :messages="getTabContent(item.value)?.messages || []"
          :message-type="getTabContent(item.value)?.typeName || item.value"
        />
      </template>
    </UTabs>
  </div>

  <div
    v-else
    class="text-center py-12 text-(--ui-text-muted)"
  >
    <UIcon
      name="i-lucide-file-search"
      class="mx-auto mb-4 text-4xl"
    />
    <p>No messages found in this FIT file</p>
  </div>
</template>
