<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Garmin Tools'
const description = 'Handy utilities for Garmin device data. Generate Weight Scale FIT files, convert, and analyze.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <AppLogo
            size="text-base"
            class="hidden sm:inline"
          />
        </NuxtLink>

        <UNavigationMenu
          :items="[{
            label: 'Home',
            to: '/'
          }, {
            label: 'Weight Tool',
            to: '/weight'
          }]"
          variant="link"
          color="neutral"
        />
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/marcelorodrigo/garmin-tools"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-(--ui-text-muted)">
          © {{ new Date().getFullYear() }} Garmin Tools
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/marcelorodrigo/garmin-tools"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
