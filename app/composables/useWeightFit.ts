import { Encoder, Profile } from '@garmin/fitsdk'
import type { FileIdMesg, WeightScaleMesg } from '@garmin/fitsdk'

export interface WeightFormState {
  weight: number
  percentFat?: number
  percentHydration?: number
  visceralFatMass?: number
  boneMass?: number
  muscleMass?: number
  basalMet?: number
  physiqueRating?: number
  activeMet?: number
  metabolicAge?: number
  visceralFatRating?: number
  bmi?: number
}

export interface FormFieldSchema {
  name: string
  label: string
  type: 'number' | 'integer'
  required: boolean
  description: string
  unit?: string
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  multipleOf?: number
  example?: number
  section: 'basic' | 'composition' | 'metabolic' | 'ratings'
}

export interface FormSection {
  id: 'basic' | 'composition' | 'metabolic' | 'ratings'
  title: string
  description?: string
}

export interface FormSchema {
  version: '1.0'
  formId: 'weight-scale'
  title: string
  description: string
  sections: FormSection[]
  fields: FormFieldSchema[]
}

export const weightFormSchema: FormSchema = {
  version: '1.0',
  formId: 'weight-scale',
  title: 'Weight Scale Form',
  description: 'Record weight and body composition metrics in Garmin FIT format. The form accepts weight as a required field and multiple optional body composition, metabolic, and rating metrics.',
  sections: [
    {
      id: 'basic',
      title: 'Basic Metrics',
      description: 'Essential measurements for weight tracking'
    },
    {
      id: 'composition',
      title: 'Body Composition',
      description: 'Detailed breakdown of body mass components'
    },
    {
      id: 'metabolic',
      title: 'Metabolic Data',
      description: 'Metabolic rates and biological age'
    },
    {
      id: 'ratings',
      title: 'Fitness Ratings',
      description: 'Subjective ratings for body composition'
    }
  ],
  fields: [
    {
      name: 'weight',
      label: 'Weight',
      type: 'number',
      required: true,
      description: 'Body weight in kilograms. Required field.',
      unit: 'kg',
      exclusiveMinimum: 0,
      multipleOf: 0.1,
      example: 75.5,
      section: 'basic'
    },
    {
      name: 'bmi',
      label: 'Body Mass Index',
      type: 'number',
      required: false,
      description: 'Body mass index calculated as weight (kg) / height² (m²)',
      unit: 'kg/m²',
      exclusiveMinimum: 0,
      multipleOf: 0.1,
      example: 23.5,
      section: 'basic'
    },
    {
      name: 'percentFat',
      label: 'Body Fat Percentage',
      type: 'number',
      required: false,
      description: 'Percentage of body weight that is fat tissue',
      unit: '%',
      minimum: 0,
      maximum: 100,
      multipleOf: 0.1,
      example: 18.5,
      section: 'composition'
    },
    {
      name: 'percentHydration',
      label: 'Hydration Percentage',
      type: 'number',
      required: false,
      description: 'Percentage of body weight that is water',
      unit: '%',
      minimum: 0,
      maximum: 100,
      multipleOf: 0.1,
      example: 55,
      section: 'composition'
    },
    {
      name: 'visceralFatMass',
      label: 'Visceral Fat Mass',
      type: 'number',
      required: false,
      description: 'Mass of visceral fat (fat around organs) in kilograms',
      unit: 'kg',
      minimum: 0,
      multipleOf: 0.1,
      example: 3.2,
      section: 'composition'
    },
    {
      name: 'boneMass',
      label: 'Bone Mass',
      type: 'number',
      required: false,
      description: 'Total bone mass in kilograms',
      unit: 'kg',
      minimum: 0,
      multipleOf: 0.01,
      example: 2.83,
      section: 'composition'
    },
    {
      name: 'muscleMass',
      label: 'Muscle Mass',
      type: 'number',
      required: false,
      description: 'Total muscle mass in kilograms',
      unit: 'kg',
      minimum: 0,
      multipleOf: 0.01,
      example: 35.5,
      section: 'composition'
    },
    {
      name: 'basalMet',
      label: 'Basal Metabolic Rate',
      type: 'number',
      required: false,
      description: 'Energy expenditure at rest in kilocalories per day',
      unit: 'kcal/day',
      minimum: 0,
      multipleOf: 1,
      example: 1700,
      section: 'metabolic'
    },
    {
      name: 'activeMet',
      label: 'Active Metabolic Rate',
      type: 'number',
      required: false,
      description: 'Energy expenditure with activity in kilocalories per day',
      unit: 'kcal/day',
      minimum: 0,
      multipleOf: 1,
      example: 2100,
      section: 'metabolic'
    },
    {
      name: 'metabolicAge',
      label: 'Metabolic Age',
      type: 'integer',
      required: false,
      description: 'Biological age estimate based on metabolic rate in years',
      unit: 'years',
      minimum: 1,
      multipleOf: 1,
      example: 30,
      section: 'metabolic'
    },
    {
      name: 'physiqueRating',
      label: 'Physique Rating',
      type: 'integer',
      required: false,
      description: 'Body composition rating from 1 (Hidden Obese) to 9 (Very Muscular), based on body fat to muscle mass ratio',
      minimum: 1,
      maximum: 9,
      multipleOf: 1,
      example: 5,
      section: 'ratings'
    },
    {
      name: 'visceralFatRating',
      label: 'Visceral Fat Rating',
      type: 'integer',
      required: false,
      description: 'Visceral fat level from 1 to 59. Healthy/standard: 1-12, High/excess: 13-59',
      minimum: 1,
      maximum: 59,
      multipleOf: 1,
      example: 8,
      section: 'ratings'
    }
  ]
}

export function useWeightFitSchema() {
  return weightFormSchema
}

export function useWeightFit() {
  function encode(data: WeightFormState): Uint8Array {
    const encoder = new Encoder()

    const fileId: FileIdMesg = {
      type: 'weight',
      manufacturer: 'garmin',
      product: 2429,
      serialNumber: 0,
      timeCreated: new Date()
    }
    encoder.onMesg(Profile.MesgNum.FILE_ID!, fileId)

    const weightScale: WeightScaleMesg = {
      timestamp: new Date(),
      weight: data.weight,
      userProfileIndex: 0,
      ...(data.percentFat !== undefined ? { percentFat: data.percentFat } : {}),
      ...(data.percentHydration !== undefined ? { percentHydration: data.percentHydration } : {}),
      ...(data.visceralFatMass !== undefined ? { visceralFatMass: data.visceralFatMass } : {}),
      ...(data.boneMass !== undefined ? { boneMass: data.boneMass } : {}),
      ...(data.muscleMass !== undefined ? { muscleMass: data.muscleMass } : {}),
      ...(data.basalMet !== undefined ? { basalMet: data.basalMet } : {}),
      ...(data.physiqueRating !== undefined ? { physiqueRating: data.physiqueRating } : {}),
      ...(data.activeMet !== undefined ? { activeMet: data.activeMet } : {}),
      ...(data.metabolicAge !== undefined ? { metabolicAge: data.metabolicAge } : {}),
      ...(data.visceralFatRating !== undefined ? { visceralFatRating: data.visceralFatRating } : {}),
      ...(data.bmi !== undefined ? { bmi: data.bmi } : {})
    }
    encoder.onMesg(Profile.MesgNum.WEIGHT_SCALE!, weightScale)

    return encoder.close()
  }

  return { encode }
}
