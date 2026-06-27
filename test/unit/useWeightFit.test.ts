import { describe, expect, it } from 'vitest'
import { Decoder, Stream } from '@garmin/fitsdk'
import { useWeightFit, useWeightFitSchema } from '../../app/composables/useWeightFit'
import publishedSchema from '../../public/weight-form-schema.json'

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

  describe('useWeightFitSchema', () => {
    it('returns a valid FormSchema object', () => {
      const schema = useWeightFitSchema()
      expect(schema).toBeDefined()
      expect(schema.version).toBe('1.0')
      expect(schema.formId).toBe('weight-scale')
    })

    it('has required schema metadata', () => {
      const schema = useWeightFitSchema()
      expect(schema.title).toBeDefined()
      expect(schema.title).toBeTruthy()
      expect(schema.description).toBeDefined()
      expect(schema.description).toBeTruthy()
    })

    it('contains all form sections', () => {
      const schema = useWeightFitSchema()
      const sectionIds = schema.sections.map(s => s.id)
      expect(sectionIds).toContain('basic')
      expect(sectionIds).toContain('composition')
      expect(sectionIds).toContain('metabolic')
      expect(sectionIds).toContain('ratings')
    })

    it('has a section for each form section', () => {
      const schema = useWeightFitSchema()
      expect(schema.sections).toHaveLength(4)
      schema.sections.forEach((section) => {
        expect(section.id).toBeDefined()
        expect(section.title).toBeDefined()
      })
    })

    it('includes all WeightFormState fields in schema', () => {
      const schema = useWeightFitSchema()
      const schemaFieldNames = schema.fields.map(f => f.name)

      expect(schemaFieldNames).toContain('weight')
      expect(schemaFieldNames).toContain('percentFat')
      expect(schemaFieldNames).toContain('percentHydration')
      expect(schemaFieldNames).toContain('visceralFatMass')
      expect(schemaFieldNames).toContain('boneMass')
      expect(schemaFieldNames).toContain('muscleMass')
      expect(schemaFieldNames).toContain('basalMet')
      expect(schemaFieldNames).toContain('physiqueRating')
      expect(schemaFieldNames).toContain('activeMet')
      expect(schemaFieldNames).toContain('metabolicAge')
      expect(schemaFieldNames).toContain('visceralFatRating')
      expect(schemaFieldNames).toContain('bmi')
    })

    it('marks weight field as required', () => {
      const schema = useWeightFitSchema()
      const weightField = schema.fields.find(f => f.name === 'weight')
      expect(weightField).toBeDefined()
      expect(weightField?.required).toBe(true)
    })

    it('marks optional fields as not required', () => {
      const schema = useWeightFitSchema()
      const optionalFields = schema.fields.filter(f => f.name !== 'weight')
      optionalFields.forEach((field) => {
        expect(field.required).toBe(false)
      })
    })

    it('specifies correct types for numeric fields', () => {
      const schema = useWeightFitSchema()
      const numberFields = ['weight', 'bmi', 'percentFat', 'percentHydration', 'visceralFatMass', 'boneMass', 'muscleMass', 'basalMet', 'activeMet']
      numberFields.forEach((fieldName) => {
        const field = schema.fields.find(f => f.name === fieldName)
        expect(field?.type).toBe('number')
      })
    })

    it('specifies correct types for integer fields', () => {
      const schema = useWeightFitSchema()
      const integerFields = ['metabolicAge', 'physiqueRating', 'visceralFatRating']
      integerFields.forEach((fieldName) => {
        const field = schema.fields.find(f => f.name === fieldName)
        expect(field?.type).toBe('integer')
      })
    })

    it('includes validation constraints for percentage fields', () => {
      const schema = useWeightFitSchema()
      const percentFatField = schema.fields.find(f => f.name === 'percentFat')
      expect(percentFatField?.minimum).toBe(0)
      expect(percentFatField?.maximum).toBe(100)
    })

    it('includes validation constraints for rating fields', () => {
      const schema = useWeightFitSchema()
      const physiqueField = schema.fields.find(f => f.name === 'physiqueRating')
      expect(physiqueField?.minimum).toBe(1)
      expect(physiqueField?.maximum).toBe(9)

      const visceralFatField = schema.fields.find(f => f.name === 'visceralFatRating')
      expect(visceralFatField?.minimum).toBe(1)
      expect(visceralFatField?.maximum).toBe(59)
    })

    it('specifies unit information for fields', () => {
      const schema = useWeightFitSchema()
      const weightField = schema.fields.find(f => f.name === 'weight')
      expect(weightField?.unit).toBe('kg')

      const percentFatField = schema.fields.find(f => f.name === 'percentFat')
      expect(percentFatField?.unit).toBe('%')

      const metabolicField = schema.fields.find(f => f.name === 'basalMet')
      expect(metabolicField?.unit).toBe('kcal/day')
    })

    it('includes example values for all fields', () => {
      const schema = useWeightFitSchema()
      schema.fields.forEach((field) => {
        expect(field.example).toBeDefined()
        expect(typeof field.example === 'number').toBe(true)
      })
    })

    it('includes descriptions for all fields', () => {
      const schema = useWeightFitSchema()
      schema.fields.forEach((field) => {
        expect(field.description).toBeDefined()
        expect(field.description.length).toBeGreaterThan(0)
      })
    })

    it('assigns each field to a valid section', () => {
      const schema = useWeightFitSchema()
      const validSections = ['basic', 'composition', 'metabolic', 'ratings']
      schema.fields.forEach((field) => {
        expect(validSections).toContain(field.section)
      })
    })

    it('has appropriate constraints for weight field', () => {
      const schema = useWeightFitSchema()
      const weightField = schema.fields.find(f => f.name === 'weight')
      expect(weightField?.exclusiveMinimum).toBe(0)
    })

    it('includes step size for numeric fields', () => {
      const schema = useWeightFitSchema()
      const fieldsWithMultipleOf = ['weight', 'bmi', 'percentFat', 'percentHydration', 'visceralFatMass', 'boneMass', 'muscleMass', 'basalMet', 'activeMet', 'metabolicAge', 'physiqueRating', 'visceralFatRating']
      fieldsWithMultipleOf.forEach((fieldName) => {
        const field = schema.fields.find(f => f.name === fieldName)
        expect(field?.multipleOf).toBeDefined()
        expect(field?.multipleOf).toBeGreaterThan(0)
      })
    })

    it('published artifact matches useWeightFitSchema contract', () => {
      const schema = useWeightFitSchema()

      // Check title and description match
      expect(publishedSchema.title).toBe(schema.title)
      expect(publishedSchema.description).toBe(schema.description)

      // Check all field names are present in published schema
      const publishedFieldNames = Object.keys(publishedSchema.properties || {})
      const schemaFieldNames = schema.fields.map(f => f.name)
      expect(publishedFieldNames.sort()).toEqual(schemaFieldNames.sort())

      // Check each field contract matches
      schema.fields.forEach((field) => {
        const publishedField = publishedSchema.properties?.[field.name]
        expect(publishedField).toBeDefined()
        expect(publishedField.type).toBe(field.type)
        expect(publishedField.title).toBe(field.label)
        expect(publishedField.description).toBe(field.description)
        if (field.unit) {
          expect(publishedField.unit).toBe(field.unit)
        }
        if (field.minimum !== undefined) {
          expect(publishedField.minimum).toBe(field.minimum)
        }
        if (field.maximum !== undefined) {
          expect(publishedField.maximum).toBe(field.maximum)
        }
        if (field.multipleOf !== undefined) {
          expect(publishedField.multipleOf).toBe(field.multipleOf)
        }
        if (field.example !== undefined) {
          expect(publishedField.example).toBe(field.example)
        }
      })

      // Check required fields match
      const requiredFields = schema.fields.filter(f => f.required).map(f => f.name)
      expect(publishedSchema.required).toEqual(requiredFields)
    })
  })
})
