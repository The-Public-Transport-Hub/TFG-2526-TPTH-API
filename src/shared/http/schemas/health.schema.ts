import { z } from "zod";

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    status: z.literal('healthy'),
    database: z.literal('connected'),
  }),
})
.openapi('Health Response')
