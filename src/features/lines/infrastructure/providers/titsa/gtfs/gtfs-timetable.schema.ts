import { z } from 'zod'

export const gtfsPackageResponseSchema = z.object({
  success: z.literal(true),
  result: z.object({
    resources: z.array(
      z.object({
        format: z.string().optional(),
        mimetype: z.string().nullable().optional(),
        url: z.url(),
      })
    ),
  }),
})

export const gtfsRouteSchema = z.object({
  route_id: z.string(),
  route_short_name: z.string(),
  route_long_name: z.string().optional(),
})

export const gtfsTripSchema = z.object({
  route_id: z.string(),
  service_id: z.string(),
  trip_id: z.string(),
  trip_headsign: z.string().optional(),
})

export const gtfsStopTimeSchema = z.object({
  trip_id: z.string(),
  arrival_time: z.string(),
  departure_time: z.string(),
  stop_id: z.string(),
  stop_sequence: z.string(),
})

export const gtfsStopSchema = z.object({
  stop_id: z.string(),
  stop_name: z.string(),
})

export const gtfsCalendarDateSchema = z.object({
  service_id: z.string(),
  date: z.string(),
  exception_type: z.string(),
})
