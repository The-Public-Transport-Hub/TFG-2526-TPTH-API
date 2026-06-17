import { z } from '@hono/zod-openapi'

export const lineSchema = z.object({
  id: z.string().openapi( { example: '108'}),
  name: z.string().openapi({ example: 'ENLACE LOS REALEJOS SANTA CRUZ' }),
})
.openapi('Line')

export const linesSchema = z.array(lineSchema).openapi('Lines')

export type Lines = z.infer<typeof lineSchema>
