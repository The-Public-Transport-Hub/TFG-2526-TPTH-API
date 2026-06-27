import { z } from '@hono/zod-openapi'

export const tramSchema = z.object({
   id: z.string().openapi( { example: 'L1'}),
   name: z.string().openapi({ example: 'SANTA CRUZ - LA LAGUNA' }),
}).openapi('Tram')

export const tramsSchema = z.array(tramSchema).openapi('Trams')

export type Trams = z.infer<typeof tramSchema>
