import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useFitViewer } from '../../app/composables/useFitViewer'

vi.mock('@garmin/fitsdk', () => {
  const originalModule = vi.importActual('@garmin/fitsdk')
  return {
    ...originalModule,
    Decoder: vi.fn(function () {
      return {
        read: vi.fn(),
        isFIT: vi.fn().mockReturnValue(true)
      }
    }),
    Stream: {
      fromArrayBuffer: vi.fn().mockReturnValue({
        arrayBuffer: new ArrayBuffer(0)
      })
    },
    Profile: {
      messages: {
        0: {
          num: 0,
          name: 'fileId',
          messagesKey: 'fileIdMesgs',
          fields: {}
        },
        49: {
          num: 49,
          name: 'fileCreator',
          messagesKey: 'fileCreatorMesgs',
          fields: {}
        }
      }
    }
  }
})

describe('useFitViewer', () => {
  let compose: ReturnType<typeof useFitViewer>

  beforeEach(() => {
    compose = useFitViewer()
    compose.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('returns initial state with null values', () => {
      expect(compose.file.value).toBeNull()
      expect(compose.result.value).toBeNull()
      expect(compose.isLoading.value).toBe(false)
      expect(compose.error.value).toBeNull()
    })
  })

  describe('validateFile', () => {
    it('rejects empty file', async () => {
      const emptyFile = new File([''], 'test.fit', { type: 'application/octet-stream' })
      await compose.decode(emptyFile)

      expect(compose.error.value).not.toBeNull()
      expect(compose.error.value?.code).toBe('EMPTY_FILE')
    })

    it('rejects file larger than 10MB', async () => {
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.fit', { type: 'application/octet-stream' })
      await compose.decode(largeFile)

      expect(compose.error.value).not.toBeNull()
      expect(compose.error.value?.code).toBe('INVALID_FILE_TYPE')
    })

    it('rejects non-.fit file', async () => {
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      await compose.decode(txtFile)

      expect(compose.error.value).not.toBeNull()
      expect(compose.error.value?.code).toBe('INVALID_FILE_TYPE')
    })
  })

  describe('clear', () => {
    it('resets all state', async () => {
      const mockDecoder = {
        read: vi.fn().mockResolvedValue({
          messages: { fileIdMesgs: [{ timestamp: new Date(), manufacturer: 'garmin' }] },
          profileVersion: { major: 21, minor: 100, patch: 0, type: 'Release' },
          errors: []
        }),
        isFIT: vi.fn().mockReturnValue(true)
      }

      const { Decoder: MockDecoder } = await import('@garmin/fitsdk')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(MockDecoder as any).mockImplementation(function () {
        return mockDecoder
      })

      const validFile = new File([new ArrayBuffer(100)], 'test.fit', { type: 'application/octet-stream' })
      await compose.decode(validFile)

      expect(compose.isLoading.value).toBe(false)
      expect(compose.file.value).not.toBeNull()

      compose.clear()

      expect(compose.file.value).toBeNull()
      expect(compose.result.value).toBeNull()
      expect(compose.error.value).toBeNull()
      expect(compose.isLoading.value).toBe(false)
    })
  })

  describe('FitViewerError', () => {
    it('creates error with code and message', async () => {
      const { FitViewerError, FIT_VIEWER_ERROR_MESSAGES } = await import('../../app/composables/useFitViewer')
      const error = new FitViewerError(FIT_VIEWER_ERROR_MESSAGES.EMPTY_FILE, 'EMPTY_FILE')

      expect(error.message).toBe(FIT_VIEWER_ERROR_MESSAGES.EMPTY_FILE)
      expect(error.code).toBe('EMPTY_FILE')
      expect(error.name).toBe('FitViewerError')
    })
  })
})

describe('useFitViewer - decode with mocked SDK', () => {
  let compose: ReturnType<typeof useFitViewer>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDecoder: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStream: any

  beforeEach(async () => {
    compose = useFitViewer()
    compose.clear()
    vi.clearAllMocks()

    mockDecoder = {
      read: vi.fn(),
      isFIT: vi.fn().mockReturnValue(true)
    }

    mockStream = {
      arrayBuffer: new ArrayBuffer(100)
    }

    const { Decoder: MockDecoder, Stream: MockStream } = await import('@garmin/fitsdk')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(MockDecoder as any).mockImplementation(function () {
      return mockDecoder
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(MockStream.fromArrayBuffer as any).mockReturnValue(mockStream)
  })

  it('handles valid FIT file with fileId message', async () => {
    mockDecoder.read.mockReturnValue({
      messages: {
        fileIdMesgs: [
          {
            timestamp: new Date('2024-01-15T10:00:00Z'),
            manufacturer: 'garmin',
            product: 2429,
            serialNumber: 12345,
            type: 'weight'
          }
        ]
      },
      profileVersion: { major: 21, minor: 208, patch: 0, type: 'Release' },
      errors: []
    })

    const validFile = new File([new ArrayBuffer(100)], 'test.fit', { type: 'application/octet-stream' })
    await compose.decode(validFile)

    expect(compose.isLoading.value).toBe(false)
    expect(compose.error.value).toBeNull()
    expect(compose.result.value).not.toBeNull()
    expect(compose.result.value?.messages.length).toBeGreaterThan(0)
    expect(compose.result.value?.messageTypes).toContain('fileIdMesgs')
    expect(compose.result.value?.profileVersion).toEqual({
      major: 21,
      minor: 208,
      patch: 0,
      type: 'Release'
    })
  })

  it('handles decode errors', async () => {
    mockDecoder.read.mockReturnValue({
      messages: {},
      profileVersion: null,
      errors: [new Error('CRC error')]
    })

    const validFile = new File([new ArrayBuffer(100)], 'test.fit', { type: 'application/octet-stream' })
    await compose.decode(validFile)

    expect(compose.error.value).not.toBeNull()
    expect(compose.error.value?.code).toBe('CRC_ERROR')
  })

  it('handles invalid FIT file (isFIT returns false)', async () => {
    mockDecoder.isFIT.mockReturnValue(false)

    const validFile = new File([new ArrayBuffer(100)], 'test.fit', { type: 'application/octet-stream' })
    await compose.decode(validFile)

    expect(compose.error.value).not.toBeNull()
    expect(compose.error.value?.code).toBe('NOT_FIT_FILE')
  })

  it('handles SDK throwing exception', async () => {
    mockDecoder.read.mockRejectedValue(new Error('Unexpected SDK error'))

    const validFile = new File([new ArrayBuffer(100)], 'test.fit', { type: 'application/octet-stream' })
    await compose.decode(validFile)

    expect(compose.error.value).not.toBeNull()
    expect(compose.error.value?.code).toBe('DECODE_ERROR')
  })
})
