import { z } from 'zod'

export const timetableStopSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const timetableTimeSchema = z.object({
  departure: z.string(),
  arrival: z.string(),
})

export const timetableVariantSchema = z.object({
  origin: timetableStopSchema,
  destination: timetableStopSchema,
  times: z.array(timetableTimeSchema),
})

export const lineTimetableDocumentSchema = z.object({
  lineNumber: z.string(),
  lineName: z.string(),
  provider: z.string(),
  month: z.string(),
  dayType: z.enum(['weekday', 'saturday', 'sunday_or_holiday']),
  direction: z.enum(['outbound', 'inbound']),
  variants: z.array(timetableVariantSchema),
  source: z.object({
    sampleDate: z.string(),
    matchedDates: z.number(),
  }),
  syncedAt: z.iso.datetime(),
})

export type LineTimetableDocument = z.infer<typeof lineTimetableDocumentSchema>
export type TimetableStop = z.infer<typeof timetableStopSchema>
export type TimetableVariant = z.infer<typeof timetableVariantSchema>
