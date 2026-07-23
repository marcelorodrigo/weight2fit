<script setup lang="ts">
withDefaults(defineProps<{
  as?: 'span' | 'div' | 'h1' | 'h2'
  size?: string
}>(), {
  as: 'span',
  size: 'text-base'
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'font-semibold inline-block',
      'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent bg-[length:200%_100%]',
      'animate-shimmer',
      size,
      $attrs.class
    ]"
  >
    Weight 2 FIT
  </component>
</template>
