import { z } from '@hono/zod-openapi'

export const tramSchema = z.object({
   id: z.string().openapi( { example: 'L1'}),
   name: z.string().openapi({ example: 'SANTA CRUZ - LA LAGUNA' }),
}).openapi('Tram')

export const tramsSchema = z.array(tramSchema).openapi('Trams')

export const tramStopSchema = z.object({
  id: z.string().openapi({ example: "INT" }),
  name: z.string().openapi({ example: "INTERCAMBIADOR" }),
  order: z.number().openapi({ example: 1 }),
}).openapi("Tram Stop");

export const tramDetailSchema = z.object({
  id: z.string().openapi({ example: "L1" }),
  name: z.string().openapi({ example: "SANTA CRUZ - LA LAGUNA" }),
  direction: z.enum(["outbound", "inbound"]),
  destination: z.string().openapi({ example: "TRINIDAD" }),
  stops: z.array(tramStopSchema),
});
