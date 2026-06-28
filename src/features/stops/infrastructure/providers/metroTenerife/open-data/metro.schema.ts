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
