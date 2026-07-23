<script setup lang="ts">
import FitMessageTable from './FitMessageTable.vue'
import type { FitMessage, FitDecodeResult } from '~/composables/useFitViewer'

interface Props {
  result: FitDecodeResult | null
}

const props = defineProps<Props>()

interface MessageGroup {
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

const activeTab = ref('')

watch(messageGroups, (groups) => {
  if (!groups.some(group => group.value === activeTab.value)) {
    activeTab.value = groups[0]?.value ?? ''
  }
}, { immediate: true })

const activeGroup = computed<MessageGroup | undefined>(() => {
  return messageGroups.value.find(group => group.value === activeTab.value)
})

const tabItems = computed(() => {
  return messageGroups.value.map(group => ({
    label: group.label,
    badge: group.count,
    value: group.value
  }))
})

const selectItems = computed(() => {
  return messageGroups.value.map(group => ({
    label: `${group.label} (${group.count})`,
    value: group.value
  }))
})

function formatTypeName(typeKey: string): string {
  return typeKey
    .replace(/Mesgs?$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim()
}
</script>

<template>
  <div
    v-if="messageGroups.length > 0"
    class="space-y-4"
  >
    <UFormField
      label="Message type"
      class="sm:hidden"
    >
      <USelect
        v-model="activeTab"
        :items="selectItems"
        size="xl"
        aria-label="Message type"
        class="min-h-11 w-full"
      />
    </UFormField>

    <UTabs
      v-model="activeTab"
      :items="tabItems"
      :content="false"
      class="hidden w-full sm:flex"
    />

    <FitMessageTable
      v-if="activeGroup"
      :messages="activeGroup.messages"
      :message-type="activeGroup.typeName"
    />
  </div>

  <div
    v-else
    class="py-12 text-center text-muted"
  >
    <UIcon
      name="i-lucide-file-search"
      class="mx-auto mb-4 text-4xl"
    />
    <p>No messages found in this FIT file</p>
  </div>
</template>
