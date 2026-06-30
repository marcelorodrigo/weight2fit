import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

const { mockRef } = vi.hoisted(() => {
  let value: Record<string, unknown> | null = null
  const ref = {
    get value() { return value },
    set value(v: Record<string, unknown> | null) { value = v }
  }
  return { mockRef: ref }
})

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useLocalStorage: vi.fn(() => mockRef)
  }
})

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

async function mountPage() {
  const mod = await import('~/pages/weight.vue')
  return mountSuspended(mod.default)
}

describe('weight page', () => {
  beforeEach(() => {
    mockRef.value = null
  })

  it('renders all four section cards', async () => {
    const page = await mountPage()

    const headings = page.findAll('h2')
    const labels = headings.map(h => h.text())
    expect(headings).toHaveLength(4)
    expect(labels).toEqual(['Basic', 'Body Composition', 'Metabolic', 'Ratings'])
  })

  it('renders a submit button', async () => {
    const page = await mountPage()

    const button = page.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Generate')
  })

  it('renders the Weight page hero section', async () => {
    const page = await mountPage()

    expect(page.text()).toContain('Weight Scale FIT Generator')
  })

  describe('download', () => {
    it('generates a unique filename with timestamp', async () => {
      URL.createObjectURL = vi.fn().mockReturnValue('blob:mock')
      const createElementSpy = vi.spyOn(document, 'createElement')

      const page = await mountPage()
      await setField(page, 0, '75')
      await page.find('form').trigger('submit')
      await flushPromises()

      const anchorCalls = createElementSpy.mock.results
        .filter(r => r.value.tagName === 'A')
        .map(r => r.value as HTMLAnchorElement)

      const lastAnchor = anchorCalls.at(-1)
      expect(lastAnchor).toBeDefined()
      expect(lastAnchor!.download).toMatch(/^weight-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.fit$/)
    })
  })

  describe('validation', () => {
    it('shows error when weight is missing', async () => {
      const page = await mountPage()

      await page.find('form').trigger('submit')
      await flushPromises()

      expect(page.text()).toContain('Weight is required')
    })

    it('shows error when weight is zero', async () => {
      const page = await mountPage()

      await setField(page, 0, '0')
      await page.find('form').trigger('submit')
      await flushPromises()

      expect(page.text()).toContain('Weight is required')
    })

    it('shows no errors when only required weight is provided', async () => {
      const page = await mountPage()

      await setField(page, 0, '75')
      await page.find('form').trigger('submit')
      await flushPromises()

      expect(page.text()).not.toContain('Weight is required')
      expect(page.text()).not.toContain('must be')
    })
  })
})

describe('persistence', () => {
  beforeEach(() => {
    mockRef.value = null
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock')
  })

  it('shows restore prompt when no saved data', async () => {
    const page = await mountPage()
    await flushPromises()

    expect(page.text()).not.toContain('Restore previous data?')
  })

  it('saves form data on successful submit', async () => {
    const page = await mountPage()
    await flushPromises()

    await setField(page, 0, '82')
    await page.find('form').trigger('submit')
    await flushPromises()

    expect(page.text()).not.toContain('error')
  })
})

async function setField(page: Awaited<ReturnType<typeof mountPage>>, index: number, value: string) {
  const inputs = page.findAll('input')
  const input = inputs[index]
  if (input) {
    await input.setValue(value)
    await input.trigger('blur')
  }
}
