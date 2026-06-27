import { z } from "@hono/zod-openapi";
import { tramsSchema } from "./tram.schema";

export const tramResponseSchema = z
  .object({
    ok: z.literal(true),
    data: tramsSchema,
  })
  .openapi("Trams Response Schema");
