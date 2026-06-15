import z from "zod";

export const stopDocumentSchema = z.object({
  code: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  provider: z.string(),
  syncedAt: z.iso.datetime(),
})

export type StopDocument = z.infer<typeof stopDocumentSchema>;
