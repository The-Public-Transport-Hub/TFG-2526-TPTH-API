import { z } from '@hono/zod-openapi'

export const lineSchema = z.object({
  id: z.string().openapi( { example: '108'}),
  name: z.string().openapi({ example: 'ENLACE LOS REALEJOS SANTA CRUZ' }),
})
.openapi('Line')

export const linesSchema = z.array(lineSchema).openapi('Lines')

export const lineStopSchema = z.object({
  id: z.string().openapi({ example: "4009" }),
  name: z.string().openapi({ example: "ESTACION LA OROTAVA" }),
  order: z.number().openapi({ example: 1 }),
}).openapi("Line Stop");

export const lineDirectionSchema = z.object({
  direction: z.enum(["outbound", "inbound"]),
  destination: z.string().openapi({ example: "LA OROTAVA" }),
  stops: z.array(lineStopSchema),
}).openapi("Line Direction");

export const lineDetailSchema = z.object({
  id: z.string().openapi({ example: "108" }),
  name: z.string().openapi({ example: "SANTA CRUZ - LA OROTAVA" }),
  directions: z.array(lineDirectionSchema),
}).openapi("Line Detail");
