<script setup lang="ts">
const config = useAppConfig()

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
          }, {
            label: 'Fields',
            to: '/fields'
          }, {
            label: 'About',
            to: '/about'
          }]"
          variant="link"
          color="neutral"
        />
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/marcelorodrigo/weight2fit"
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
          © {{ new Date().getFullYear() }} Weight 2 FIT
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/marcelorodrigo/weight2fit"
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
