import { z } from "zod";

export const externalTramStopsSchema = z.object({
  type: z.literal("FeatureCollection"),
  name: z.string(),
  features: z.array(
    z.object({
      type: z.literal("Feature"),
      properties: z.object({
        parada_id: z.number(),
        parada_nombre: z.string(),
        parada_descripcion: z.string().nullable(),
        parada_latitud: z.number(),
        parada_longitud: z.number(),
        parada_url: z.string(),
      }),
      geometry: z.object({
        type: z.literal("Point"),
        coordinates: z.tuple([z.number(), z.number()]),
      }),
    }),
  ),
});

export type ExternalTramStops = z.infer<typeof externalTramStopsSchema>;

export const externalTramStopDetailSchema = z.array(
  z.object({
    service: z.string(),
    stop: z.string(),
    stopSAE: z.number(),
    destinationStop: z.string(),
    stopDescription: z.string(),
    destinationStopDescription: z.string(),
    route: z.number(),
    direction: z.number(),
    lastUpdate: z.number(),
    lastUpdateFormatted: z.string(),
    remainingMinutes: z.number(),
    orderStop: z.number(),
  }),
);

export type ExternalTramStopDetail = z.infer<typeof externalTramStopDetailSchema>;
