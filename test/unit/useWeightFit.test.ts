import { describe, expect, it } from 'vitest'
import { Decoder, Stream } from '@garmin/fitsdk'
import { useWeightFit, useWeightFitSchema, type WeightFormState, type FormSchema } from '../../app/composables/useWeightFit'

describe('useWeightFit', () => {
  describe('encode', () => {
    it('returns a non-empty Uint8Array with only weight provided', () => {
      const { encode } = useWeightFit()
      const result = encode({ weight: 75.5 })
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBeGreaterThan(0)
    })

    it('encodes all optional fields when provided', () => {
      const { encode } = useWeightFit()
      const result = encode({
        weight: 75.5,
        percentFat: 18.5,
        percentHydration: 55,
        visceralFatMass: 3.2,
        boneMass: 2.8,
        muscleMass: 35.0,
        basalMet: 1700,
        physiqueRating: 7,
        activeMet: 2100,
        metabolicAge: 30,
        visceralFatRating: 3,
        bmi: 23.5
      })
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBeGreaterThan(0)
    })

    it('round-trips weight and optional fields via Decoder', () => {
      const { encode } = useWeightFit()
      const input = {
        weight: 80.0,
        percentFat: 15.2,
        bmi: 24.8
      }
      const bytes = encode(input)

      const stream = Stream.fromByteArray(bytes)
      const decoder = new Decoder(stream)
      const { messages } = decoder.read()

      expect(messages.weightScaleMesgs).toHaveLength(1)
      expect(messages.weightScaleMesgs![0].weight).toBe(input.weight)
      expect(messages.weightScaleMesgs![0].percentFat).toBe(input.percentFat)
      expect(messages.weightScaleMesgs![0].bmi).toBe(input.bmi)
    })

    it('sets userProfileIndex to 0', () => {
      const { encode } = useWeightFit()
      const bytes = encode({ weight: 70 })

      const stream = Stream.fromByteArray(bytes)
      const decoder = new Decoder(stream)
      const { messages } = decoder.read()

      expect(messages.weightScaleMesgs![0].userProfileIndex).toBe(0)
    })

    it('sets timestamp as a Date instance', () => {
      const { encode } = useWeightFit()
      const bytes = encode({ weight: 70 })

      const stream = Stream.fromByteArray(bytes)
      const decoder = new Decoder(stream)
      const { messages } = decoder.read()

      expect(messages.weightScaleMesgs![0].timestamp).toBeInstanceOf(Date)
    })
  })
})
