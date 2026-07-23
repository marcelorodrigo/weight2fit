import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

async function mountPage() {
  const mod = await import('~/pages/index.vue')
  return mountSuspended(mod.default, { route: '/' })
}

describe('home page', () => {
  it('presents one clear, outcome-focused heading', async () => {
    const page = await mountPage()
    const headings = page.findAll('h1')

    expect(headings).toHaveLength(1)
    expect(headings[0]?.text()).toContain('Create Garmin-ready FIT files')
  })

  it('makes the privacy and security benefits explicit', async () => {
    const page = await mountPage()

    expect(page.text()).toContain('100% in your browser')
    expect(page.text()).toContain('No Garmin credentials')
    expect(page.text()).toContain('No upload. No sign-in. No data relay.')
    expect(page.text()).toContain('Your account stays secure')
  })

  it('explains the three-step workflow in order', async () => {
    const page = await mountPage()
    const steps = page.findAll('[data-testid="workflow-step"] h3')

    expect(steps.map(step => step.text())).toEqual([
      'Enter your measurements',
      'Generate and download',
      'Import into Garmin Connect'
    ])
  })

  it('links to each tool from the toolkit', async () => {
    const page = await mountPage()
    const links = page.findAll('a[data-testid="tool-card"]')
      .map(link => link.attributes('href'))

    expect(links).toEqual(['/weight', '/viewer', '/fields'])
  })

  it('keeps GitHub as a secondary external action', async () => {
    const page = await mountPage()
    const githubLink = page.find('a[href="https://github.com/marcelorodrigo/weight2fit"]')

    expect(githubLink.exists()).toBe(true)
    expect(githubLink.attributes('target')).toBe('_blank')
    expect(githubLink.text()).toContain('View source on GitHub')
  })
})
