import { z } from "zod";

export const tramStopRefDocumentSchema = z.object({
  code: z.string(),
  name: z.string(),
  order: z.number(),
});

export const tramDirectionDocumentSchema = z.object({
  direction: z.enum(["outbound", "inbound"]),
  destination: z.string(),
  stops: z.array(tramStopRefDocumentSchema).default([]),
});

export const tramDocumentSchema = z.object({
  number: z.string(),
  name: z.string(),
  provider: z.string(),
  directions: z.array(tramDirectionDocumentSchema).default([]),
  syncedAt: z.iso.datetime(),
});

export type TramDocument = z.infer<typeof tramDocumentSchema>;
