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
