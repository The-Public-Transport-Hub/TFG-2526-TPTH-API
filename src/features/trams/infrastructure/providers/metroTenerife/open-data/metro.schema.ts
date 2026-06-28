import z from "zod";

// LINES
export const externalTramsLinesSchema = z.object({
  type: z.literal("FeatureCollection"),
  name: z.string(),
  features: z.array(
    z.object({
      type: z.literal("Feature"),
      properties: z.object({
        linea_id: z.string(),
        linea_nombre: z.string(),
        linea_descripcion: z.string(),
        linea_parada_inicio: z.string(),
        linea_parada_fin: z.string(),
      }),
      geometry: z.object({
        type: z.literal("LineString"),
        coordinates: z.array(z.tuple([z.number(), z.number()])),
      }),
    }),
  ),
});

export type ExternalTramsLines = z.infer<typeof externalTramsLinesSchema>;

// STOPS
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
