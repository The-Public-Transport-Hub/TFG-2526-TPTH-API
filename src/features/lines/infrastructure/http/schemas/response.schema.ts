import { z } from "@hono/zod-openapi";
import { linesSchema } from "./line.schema";

export const linesResponseSchema = z
  .object({
    ok: z.literal(true),
    page: z.number(),
    data: linesSchema,
    totalPages: z.number(),
    totalResults: z.number()
  })
  .openapi("Lines Response Schema");
