import { reactive, computed } from 'vue'
import { Decoder, Stream, Profile } from '@garmin/fitsdk'
import type { ProfileVersion } from '@garmin/fitsdk'

export interface FitMessageField {
  name: string
  value: unknown
  rawValue: unknown
  unit?: string
  type?: string
}

export interface FitMessage {
  type: string
  typeKey: string
  localMesgNum: number
  fields: FitMessageField[]
  developerFields?: Record<string, unknown>
  timestamp?: Date
}

export interface FitDecodeResult {
  messages: FitMessage[]
  profileVersion: ProfileVersion | null
  errors: Error[]
  messageTypes: string[]
}

export interface FitViewerState {
  file: File | null
  result: FitDecodeResult | null
  isLoading: boolean
  error: FitViewerError | null
}

export class FitViewerError extends Error {
  constructor(
    message: string,
    public readonly code: FitViewerErrorCode,
    override readonly cause?: Error
  ) {
    super(message)
    Object.defineProperty(this, 'name', { value: 'FitViewerError' })
  }
}

export type FitViewerErrorCode
  = | 'NO_FILE_SELECTED'
    | 'INVALID_FILE_TYPE'
    | 'FILE_READ_ERROR'
    | 'DECODE_ERROR'
    | 'EMPTY_FILE'
    | 'CRC_ERROR'
    | 'NOT_FIT_FILE'

export const FIT_VIEWER_ERROR_MESSAGES: Record<FitViewerErrorCode, string> = {
  NO_FILE_SELECTED: 'No file selected. Please choose a .fit file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a .fit file.',
  FILE_READ_ERROR: 'Failed to read file. The file may be corrupted.',
  DECODE_ERROR: 'Failed to decode FIT file. The file may be corrupted or invalid.',
  EMPTY_FILE: 'The selected file is empty.',
  CRC_ERROR: 'CRC check failed. The FIT file may be corrupted.',
  NOT_FIT_FILE: 'The selected file is not a valid FIT file.'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

const MESSAGE_TYPE_ORDER = [
  'fileId', 'fileCreator', 'timestampCorrelation', 'deviceInfo', 'deviceAuxBatteryInfo',
  'screenDisplay', 'fieldDescription', 'developerDataId', 'session', 'lap', 'record',
  'event', 'hr', 'hrv', 'stressLevel', 'monitoring', 'monitoringInfo', 'weightScale',
  'bloodPressure', 'activity', 'workout', 'workoutStep', 'schedule', 'course',
  'coursePoint', 'totals', 'goal', 'segment', 'segmentLap', 'memoGlob', 'antRx',
  'antTx', 'exdScreenConfiguration', 'exdDataFieldConfiguration', 'exdDataConceptConfiguration',
  'diveSettings', 'diveGas', 'diveAlarm', 'exerciseTitle', 'climbPro', 'gyroscopeData',
  'accelerometerData', 'magnetometerData', 'barometerData', 'oneDComponent', 'connectIqApp',
  'connectIqAppOwner', 'connectIqAppInfo'
]

function sortMessageTypes(types: string[]): string[] {
  return types.sort((a, b) => {
    const aIndex = MESSAGE_TYPE_ORDER.indexOf(a)
    const bIndex = MESSAGE_TYPE_ORDER.indexOf(b)
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })
}

function getMessageTypeName(mesgNum: number): string {
  const messageProfile = Profile.messages[mesgNum]
  return messageProfile?.name ?? `Message ${mesgNum}`
}

function getFieldUnit(mesgNum: number, fieldNum: number): string | undefined {
  const messageProfile = Profile.messages[mesgNum]
  const field = messageProfile?.fields?.[fieldNum]
  const units = field?.units
  if (typeof units === 'string') return units
  return undefined
}

function getFieldType(mesgNum: number, fieldNum: number): string | undefined {
  const messageProfile = Profile.messages[mesgNum]
  const field = messageProfile?.fields?.[fieldNum]
  return field?.type
}

function findMesgNum(typeKey: string): number | undefined {
  for (const [num, msgProfile] of Object.entries(Profile.messages)) {
    if (msgProfile.messagesKey === typeKey) return Number(num)
  }
  return undefined
}

function buildFieldNameMap(mesgNum: number): Map<string, number> {
  const map = new Map<string, number>()
  const fields = Profile.messages[mesgNum]?.fields
  if (!fields) return map
  for (const [fieldNum, fieldDef] of Object.entries(fields)) {
    if (fieldDef?.name) map.set(fieldDef.name, Number(fieldNum))
  }
  return map
}

function extractMessages(decoded: ReturnType<Decoder['read']>): FitMessage[] {
  const messages: FitMessage[] = []

  for (const [typeKey, messageArray] of Object.entries(decoded.messages)) {
    if (!Array.isArray(messageArray) || messageArray.length === 0) continue

    const mesgNum = findMesgNum(typeKey)
    const typeName = mesgNum !== undefined
      ? getMessageTypeName(mesgNum)
      : typeKey.replace(/Mesgs$/, '')
    const fieldMap = mesgNum !== undefined ? buildFieldNameMap(mesgNum) : new Map<string, number>()

    for (const msg of messageArray) {
      const msgObj = msg as Record<string, unknown>
      const fields: FitMessageField[] = []
      let timestamp: Date | undefined

      for (const [key, value] of Object.entries(msgObj)) {
        if (key === 'mesgNum' || key === 'developerFields') continue
        if (key === 'timestamp' && value instanceof Date) {
          timestamp = value
          continue
        }

        const fieldNum = fieldMap.get(key)
        if (fieldNum !== undefined) {
          fields.push({
            name: key,
            value,
            rawValue: value,
            unit: getFieldUnit(mesgNum!, fieldNum),
            type: getFieldType(mesgNum!, fieldNum)
          })
        } else {
          fields.push({
            name: key,
            value,
            rawValue: value
          })
        }
      }

      messages.push({
        type: typeName,
        typeKey,
        localMesgNum: 0,
        fields,
        developerFields: msgObj.developerFields as Record<string, unknown> | undefined,
        timestamp
      })
    }
  }

  return messages
}

const state = reactive<FitViewerState>({
  file: null,
  result: null,
  isLoading: false,
  error: null
})

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

async function decodeFile(file: File): Promise<FitDecodeResult> {
  state.isLoading = true
  state.error = null
  state.file = file

  try {
    if (!file.name.toLowerCase().endsWith('.fit')) {
      state.error = new FitViewerError(FIT_VIEWER_ERROR_MESSAGES.INVALID_FILE_TYPE, 'INVALID_FILE_TYPE')
      state.isLoading = false
      return createEmptyResult()
    }

    if (file.size === 0) {
      state.error = new FitViewerError(FIT_VIEWER_ERROR_MESSAGES.EMPTY_FILE, 'EMPTY_FILE')
      state.isLoading = false
      return createEmptyResult()
    }

    if (file.size > MAX_FILE_SIZE) {
      state.error = new FitViewerError(
        `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        'INVALID_FILE_TYPE'
      )
      state.isLoading = false
      return createEmptyResult()
    }

    const arrayBuffer = await file.arrayBuffer()
    const stream = Stream.fromArrayBuffer(arrayBuffer)
    const decoder = new Decoder(stream)

    if (!decoder.isFIT()) {
      state.error = new FitViewerError(FIT_VIEWER_ERROR_MESSAGES.NOT_FIT_FILE, 'NOT_FIT_FILE')
      state.isLoading = false
      return createEmptyResult()
    }

    const decoded = decoder.read({
      expandSubFields: true,
      expandComponents: true,
      applyScaleAndOffset: true,
      convertTypesToStrings: true,
      convertDateTimesToDates: true,
      includeUnknownData: true,
      mergeHeartRates: true,
      decodeMemoGlobs: false
    })

    if (decoded.errors.length > 0) {
      const crcError = decoded.errors.find(e => e.message?.includes('CRC'))
      if (crcError) {
        state.error = new FitViewerError(FIT_VIEWER_ERROR_MESSAGES.CRC_ERROR, 'CRC_ERROR', crcError)
      } else {
        state.error = new FitViewerError(FIT_VIEWER_ERROR_MESSAGES.DECODE_ERROR, 'DECODE_ERROR', decoded.errors[0])
      }
    }

    const messages = extractMessages(decoded)
    const messageTypes = [...new Set(messages.map(m => m.typeKey))]
    const sortedTypes = sortMessageTypes(messageTypes)

    const result: FitDecodeResult = {
      messages,
      profileVersion: decoded.profileVersion ?? null,
      errors: decoded.errors,
      messageTypes: sortedTypes
    }

    state.result = result
    state.isLoading = false
    return result
  } catch (error) {
    state.error = new FitViewerError(
      error instanceof Error ? error.message : 'Unknown error during decode',
      'DECODE_ERROR',
      error instanceof Error ? error : undefined
    )
    state.isLoading = false
    return createEmptyResult()
  }
}

function createEmptyResult(): FitDecodeResult {
  return {
    messages: [],
    profileVersion: null,
    errors: [],
    messageTypes: []
  }
}

function downloadJson() {
  if (!state.result || !state.file) return

  const json = JSON.stringify(state.result, (_, value) => {
    if (value instanceof Date) return value.toISOString()
    if (typeof value === 'bigint') return value.toString()
    return value
  }, 2)

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.file.name.replace('.fit', '') || 'fit-data'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function useFitViewer() {
  const isLoading = computed(() => state.isLoading)
  const result = computed(() => state.result)
  const error = computed(() => state.error)
  const file = computed(() => state.file)

  async function decode(file: File) {
    state.file = file
    state.error = null
    state.isLoading = true
    state.result = null

    try {
      const decodeResult = await decodeFile(file)
      state.result = decodeResult
    } catch (err) {
      if (err instanceof FitViewerError) {
        state.error = err
      } else {
        state.error = new FitViewerError(
          err instanceof Error ? err.message : 'Unknown error during decode',
          'DECODE_ERROR',
          err instanceof Error ? err : undefined
        )
      }
      state.result = null
    } finally {
      state.isLoading = false
    }
  }

  function clear() {
    state.file = null
    state.result = null
    state.error = null
    state.isLoading = false
  }

  return {
    decode,
    clear,
    downloadJson,
    isLoading,
    result,
    error,
    file,
    formatBytes,
    state
  }
}
