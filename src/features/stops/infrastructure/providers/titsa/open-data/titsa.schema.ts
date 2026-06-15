import { z } from "zod";

export const externalStopsSchema = z.object({
  features: z.array(
    z.object({
      properties: z.object({
        parada_id: z.number(),
        parada_nombre: z.string(),
        latitud: z.number(),
        longitud: z.number(),
      }),
    }),
  ),
});

export type ExternalStops = z.infer<typeof externalStopsSchema>;

export const externalStopDetailSchema = z.object({
  success: z.boolean(),
  lineas: z.array(
    z.object({
      id: z.string(),
      tiempo: z.string(),
      destino: z.string(),
    }),
  ).nullable(),
});

export type ExternalStopDetail = z.infer<typeof externalStopDetailSchema>;
