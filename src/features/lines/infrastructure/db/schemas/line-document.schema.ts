import { z } from "zod";

export const lineStopRefDocumentSchema = z.object({
  code: z.string(),
  name: z.string(),
  order: z.number(),
});

export const lineDirectionDocumentSchema = z.object({
  direction: z.enum(["outbound", "inbound"]),
  destination: z.string(),
  stops: z.array(lineStopRefDocumentSchema),
});

export const lineDocumentSchema = z.object({
  number: z.string(),
  name: z.string(),
  provider: z.string(),
  directions: z.array(lineDirectionDocumentSchema).default([]),
  syncedAt: z.iso.datetime(),
});

export type LineDocument = z.infer<typeof lineDocumentSchema>;
