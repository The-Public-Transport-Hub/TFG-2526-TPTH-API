import { z } from '@hono/zod-openapi'

export const stopSchema = z.object({
  id: z.string().openapi( { example: '4009'}),
  name: z.string().openapi({ example: 'ESTACION LA OROTAVA (T)' }),
})
  .openapi('Stop')

export const stopLineSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const stopArrivalSchema = z.object({
  lineId: z.string(),
  destination: z.string(),
  minutes: z.number()
})

export const stopDetailSchema = z.object({
  id: z.string().openapi({ example: '4009' }),
  name: z.string().openapi({ example: 'ESTACION LA OROTAVA (T)' }),
  latitude: z.number(),
  longitude: z.number(),
  lines: z.array(stopLineSchema),
  arrivals: z.array(stopArrivalSchema)
})

export const stopsSchema = z.array(stopSchema).openapi('Stops')

export type Stop = z.infer<typeof stopSchema>
