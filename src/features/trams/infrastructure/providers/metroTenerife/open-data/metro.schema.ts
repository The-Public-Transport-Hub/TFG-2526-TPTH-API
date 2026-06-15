import z from "zod";

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
