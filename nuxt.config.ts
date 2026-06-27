// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/seo', '@nuxt/test-utils/module'],
  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.CF_PAGES_URL || 'https://weight2fit.marcelorodrigo.com',
    name: 'Weight 2 FIT',
    description: 'Generate Weight Scale FIT files from your body composition data. Import metrics into any FIT-compatible device or fitness app.',
    defaultLocale: 'en',
    ogImage: '/og-image.png'
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-27',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    enabled: false
  },

  sitemap: {
    sources: [
      '/api/__sitemap__/urls'
    ]
  }
})
