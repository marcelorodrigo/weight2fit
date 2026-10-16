import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov']
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          // jsdom keeps a valid location base; happy-dom yields an invalid
          // `window.location.href`, which breaks nuxt 4.6's prefetch scheduler
          // (`new URL(to.fullPath, window.location.href)` in the router
          // afterEach hook throws `TypeError: Invalid URL`)
          environmentOptions: {
            nuxt: {
              domEnvironment: 'jsdom'
            }
          }
        }
      })
    ]
  }
})
