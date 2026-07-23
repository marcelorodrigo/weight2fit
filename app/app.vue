<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const config = useAppConfig()

const navigationItems = [{
  label: 'Home',
  to: '/'
}, {
  label: 'Weight Tool',
  to: '/weight'
}, {
  label: 'FIT Viewer',
  to: '/viewer'
}, {
  label: 'Fields',
  to: '/fields'
}, {
  label: 'About',
  to: '/about'
}] satisfies NavigationMenuItem[]

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: config.seo.siteDescription },
    { name: 'keywords', content: config.seo.keywords },
    { name: 'author', content: config.seo.author },
    { name: 'theme-color', content: '#0ea5e9' },
    { property: 'og:site_name', content: config.seo.siteName },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Weight 2 FIT'
const description = 'Generate Weight Scale FIT files from your body composition data.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <UHeader
      title="Weight 2 FIT"
      mode="slideover"
      :toggle="{ class: 'size-11 lg:size-8' }"
      :menu="{ side: 'right' }"
    >
      <template #title>
        <AppLogo
          size="text-lg"
          class="whitespace-nowrap"
        />
      </template>

      <UNavigationMenu
        :items="navigationItems"
        variant="link"
        color="neutral"
      />

      <template #right>
        <UColorModeButton class="size-11 lg:size-8" />

        <UButton
          to="https://github.com/marcelorodrigo/weight2fit"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
          class="size-11 lg:size-8"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="navigationItems"
          orientation="vertical"
          variant="link"
          color="neutral"
          class="-mx-2.5"
          :ui="{ link: 'min-h-11' }"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Weight 2 FIT
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
