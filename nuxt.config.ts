// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/seo'],
  ssr: false,

  devtools: {
    enabled: true
  },

  site: {
    ...(process.env.CF_PAGES_URL && { url: process.env.CF_PAGES_URL })
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-27',

  nitro: {
    preset: 'cloudflare_pages_static',
    prerender: {
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
