import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { FitDecodeResult } from '~/composables/useFitViewer'

const result: FitDecodeResult = {
  messages: [{
    typeKey: 'fileIdMesgs',
    type: 'fileId',
    localMesgNum: 0,
    fields: [{ name: 'manufacturer', value: 'garmin', rawValue: 'garmin' }]
  }, {
    typeKey: 'recordMesgs',
    type: 'record',
    localMesgNum: 1,
    fields: [{ name: 'heartRate', value: 140, rawValue: 140, unit: 'bpm' }]
  }],
  messageTypes: ['fileIdMesgs', 'recordMesgs'],
  profileVersion: null,
  errors: []
}

async function mountTabs(props: { result: FitDecodeResult | null } = { result }) {
  const mod = await import('~/components/FitMessageTabs.vue')
  return mountSuspended(mod.default, { props })
}

describe('FitMessageTabs', () => {
  it('uses a mobile selector and content-free desktop tabs', async () => {
    const tabs = await mountTabs()
    const select = tabs.findComponent({ name: 'USelect' })
    const desktopTabs = tabs.findComponent({ name: 'UTabs' })

    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual([
      { label: 'File Id (1)', value: 'fileIdMesgs' },
      { label: 'Record (1)', value: 'recordMesgs' }
    ])
    expect(desktopTabs.exists()).toBe(true)
    expect(desktopTabs.props('content')).toBe(false)
  })

  it('renders only the selected message table', async () => {
    const tabs = await mountTabs()
    const select = tabs.findComponent({ name: 'USelect' })

    expect(tabs.findAllComponents({ name: 'FitMessageTable' })).toHaveLength(1)
    expect(tabs.findComponent({ name: 'FitMessageTable' }).props('messageType')).toBe('fileId')

    select.vm.$emit('update:modelValue', 'recordMesgs')
    await tabs.vm.$nextTick()

    expect(tabs.findAllComponents({ name: 'FitMessageTable' })).toHaveLength(1)
    expect(tabs.findComponent({ name: 'FitMessageTable' }).props('messageType')).toBe('record')
  })

  it('resets the selection when a new result has different message types', async () => {
    const tabs = await mountTabs()
    const select = tabs.findComponent({ name: 'USelect' })
    select.vm.$emit('update:modelValue', 'recordMesgs')
    await tabs.vm.$nextTick()

    const replacement: FitDecodeResult = {
      ...result,
      messages: [{
        typeKey: 'sessionMesgs',
        type: 'session',
        localMesgNum: 0,
        fields: []
      }],
      messageTypes: ['sessionMesgs']
    }

    await tabs.setProps({ result: replacement })
    await tabs.vm.$nextTick()

    expect(tabs.findComponent({ name: 'FitMessageTable' }).props('messageType')).toBe('session')
  })

  it('shows the empty state when no messages are available', async () => {
    const tabs = await mountTabs({ result: null })

    expect(tabs.text()).toContain('No messages found in this FIT file')
    expect(tabs.findComponent({ name: 'FitMessageTable' }).exists()).toBe(false)
  })
})
