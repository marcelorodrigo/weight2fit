// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/seo'],
  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    ...(process.env.CF_PAGES_URL && { url: process.env.CF_PAGES_URL })
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
  }
})
