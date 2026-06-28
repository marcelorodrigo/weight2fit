import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useFitViewer } from '~/composables/useFitViewer'

vi.mock('~/composables/useFitViewer', () => ({
  useFitViewer: vi.fn(() => ({
    state: {
      file: null,
      result: null,
      isLoading: false,
      error: null
    },
    decode: vi.fn(),
    clear: vi.fn()
  }))
}))

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

async function mountViewerPage() {
  const mod = await import('~/pages/viewer.vue')
  return mountSuspended(mod.default)
}

describe('viewer page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page hero with title and description', async () => {
    const page = await mountViewerPage()

    expect(page.text()).toContain('FIT File Viewer')
    expect(page.text()).toContain('Upload a FIT file to view its decoded contents')
  })

  it('renders the file dropzone', async () => {
    const page = await mountViewerPage()

    expect(page.findComponent({ name: 'FitFileDropzone' }).exists()).toBe(true)
    expect(page.text()).toContain('Drag & drop a .fit file here')
    expect(page.text()).toContain('or click to browse')
  })

  it('renders supported file types when no file uploaded', async () => {
    const page = await mountViewerPage()

    expect(page.text()).toContain('Supported File Types')
    expect(page.text()).toContain('Weight Scale')
    expect(page.text()).toContain('Activity Records')
    expect(page.text()).toContain('Device Info')
  })

  it('has navigation link to weight tool', async () => {
    const page = await mountViewerPage()

    const weightLink = page.find('a[href="/weight"]')
    expect(weightLink.exists()).toBe(true)
    expect(weightLink.text()).toContain('Try Weight Tool')
  })

  it('shows loading state during decode', async () => {
    const mockUseFitViewer = vi.mocked(useFitViewer)
    mockUseFitViewer.mockReturnValue({
      state: {
        file: new File(['test'], 'test.fit', { type: 'application/octet-stream' }),
        result: null,
        isLoading: true,
        error: null
      },
      decode: vi.fn(),
      clear: vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const page = await mountViewerPage()
    await flushPromises()

    expect(page.findComponent({ name: 'UProgress' }).exists()).toBe(true)
    expect(page.text()).toContain('Decoding FIT file...')
  })

  it('shows error state when decode fails', async () => {
    const mockUseFitViewer = vi.mocked(useFitViewer)
    mockUseFitViewer.mockReturnValue({
      state: {
        file: new File(['test'], 'test.fit', { type: 'application/octet-stream' }),
        result: null,
        isLoading: false,
        error: {
          name: 'FitViewerError',
          message: 'CRC check failed. The FIT file may be corrupted.',
          code: 'CRC_ERROR'
        }
      },
      decode: vi.fn(),
      clear: vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const page = await mountViewerPage()
    await flushPromises()

    expect(page.text()).toContain('CRC check failed')
    expect(page.text()).toContain('CRC_ERROR')
    expect(page.text()).toContain('Clear & Try Again')
  })

  it('shows decoded results when available', async () => {
    const mockUseFitViewer = vi.mocked(useFitViewer)
    mockUseFitViewer.mockReturnValue({
      state: {
        file: new File(['test'], 'activity.fit', { type: 'application/octet-stream' }),
        result: {
          messages: [
            { typeKey: 'fileIdMesgs', type: 'fileId', localMesgNum: 0, fields: [] },
            { typeKey: 'recordMesgs', type: 'record', localMesgNum: 1, fields: [] }
          ],
          messageTypes: ['fileIdMesgs', 'recordMesgs'],
          profileVersion: { major: 21, minor: 208 },
          errors: []
        },
        isLoading: false,
        error: null
      },
      decode: vi.fn(),
      clear: vi.fn(),
      downloadJson: vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const page = await mountViewerPage()
    await flushPromises()

    expect(page.text()).toContain('Decoded FIT File')
    expect(page.text()).toContain('2 messages')
    expect(page.text()).toContain('2 message types')
    expect(page.text()).toContain('Profile v21.208')
    expect(page.findComponent({ name: 'FitMessageTabs' }).exists()).toBe(true)
  })

  it('shows file info when file is selected', async () => {
    const mockUseFitViewer = vi.mocked(useFitViewer)
    mockUseFitViewer.mockReturnValue({
      state: {
        file: new File(['x'.repeat(1024)], 'test.fit', { type: 'application/octet-stream' }),
        result: null,
        isLoading: false,
        error: null
      },
      decode: vi.fn(),
      clear: vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const page = await mountViewerPage()
    await flushPromises()

    expect(page.text()).toContain('test.fit')
    expect(page.text()).toContain('1 KB')
  })
})
