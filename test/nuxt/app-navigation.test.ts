import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

async function mountApp() {
  const mod = await import('~/app.vue')
  return mountSuspended(mod.default, { route: '/' })
}

describe('app navigation', () => {
  it('configures the header with a mobile slideover and body navigation', async () => {
    const app = await mountApp()
    const header = app.findComponent({ name: 'UHeader' })

    expect(header.exists()).toBe(true)
    expect(header.props('mode')).toBe('slideover')
    expect(header.props('title')).toBe('Weight 2 FIT')
    expect(header.vm.$slots.body).toBeDefined()
  })

  it('renders every primary route in the desktop navigation', async () => {
    const app = await mountApp()
    const links = app.findAll('a').map(link => link.attributes('href'))

    expect(links).toEqual(expect.arrayContaining([
      '/',
      '/weight',
      '/viewer',
      '/fields',
      '/about'
    ]))
  })

  it('provides accessible labels for header actions', async () => {
    const app = await mountApp()

    expect(app.find('button[aria-label="Open menu"]').exists()).toBe(true)
    expect(app.find('a[aria-label="GitHub"]').exists()).toBe(true)
  })
})
