import { z } from 'zod'

export const externalLinesSchema = z.object({
  lineas: z.array(
    z.object({
      linea_numero: z.number(),
      linea_nombre: z.string(),
      linea_url: z.url(),
    })
  ),
})

export type ExternalLines = z.infer<typeof externalLinesSchema>;

export const externalLineItinerarySchema = z.object({
  success: z.boolean(),
  paradas: z.array(
    z.object({
      nombre: z.string(),
      codigo: z.number(),
      tipo: z.string(),
    })
  ).nullable(),
})

export type ExternalLineItinerary = z.infer<typeof externalLineItinerarySchema>;
