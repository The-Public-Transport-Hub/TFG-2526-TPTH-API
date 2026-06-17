import { z } from '@hono/zod-openapi'

import { lineSchema } from './line.schema'

export const lineStopSchema = z.object({
  id: z.string().openapi({ example: '4009' }),
  name: z.string().openapi({ example: 'ESTACION LA OROTAVA (T)' }),
})
.openapi('Line Stop')

export const lineDetailSchema = lineSchema.extend({
  destinationOutbound: z.string().optional().openapi({ example: 'SANTA CRUZ' }),
  destinationInbound: z.string().optional().openapi({ example: 'LOS REALEJOS' }),
  stopsOutbound: z.array(lineStopSchema).optional(),
  stopsInbound: z.array(lineStopSchema).optional(),
  detailSyncedAt: z.iso.datetime().optional(),
})
.openapi('Line Detail')

export const lineDirectionDetailSchema = lineSchema.extend({
  direction: z.enum(['outbound', 'inbound']).openapi({ example: 'outbound' }),
  destination: z.string().optional().openapi({ example: 'ESTACION ICOD (T)' }),
  stops: z.array(lineStopSchema),
})
.openapi('Line Direction Detail')

export const lineTimetableTimeSchema = z.object({
  departure: z.string().openapi({ example: '06:10:00' }),
  arrival: z.string().openapi({ example: '07:21:10' }),
})
.openapi('Line Timetable Time')

export const lineTimetableVariantSchema = z.object({
  origin: lineStopSchema,
  destination: lineStopSchema,
  times: z.array(lineTimetableTimeSchema),
})
.openapi('Line Timetable Variant')

export const lineTimetableSchema = z.object({
  lineNumber: z.string().openapi({ example: '108' }),
  lineName: z.string().openapi({ example: 'ENLACE LOS REALEJOS SANTA CRUZ' }),
  provider: z.string().openapi({ example: 'TITSA' }),
  month: z.string().openapi({ example: '2026-05' }),
  dayType: z.enum(['weekday', 'saturday', 'sunday_or_holiday']).openapi({ example: 'weekday' }),
  direction: z.enum(['outbound', 'inbound']).openapi({ example: 'outbound' }),
  variants: z.array(lineTimetableVariantSchema),
  source: z.object({
    sampleDate: z.string().openapi({ example: '2026-05-20' }),
    matchedDates: z.number().openapi({ example: 18 }),
  }),
})
.openapi('Line Timetable')
