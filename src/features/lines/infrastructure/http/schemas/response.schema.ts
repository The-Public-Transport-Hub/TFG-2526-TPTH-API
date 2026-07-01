import { z } from "@hono/zod-openapi";
import { linesSchema, lineDetailSchema } from "./line.schema";

export const linesResponseSchema = z
  .object({
    ok: z.literal(true),
    page: z.number(),
    data: linesSchema,
    totalPages: z.number(),
    totalResults: z.number()
  })
  .openapi("Lines Response");

export const lineDetailResponseSchema = z
  .object({
    ok: z.literal(true),
    data: lineDetailSchema,
  })
  .openapi("Line Details Response");
