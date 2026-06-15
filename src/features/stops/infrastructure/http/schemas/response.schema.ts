import { z } from "@hono/zod-openapi";
import { stopsSchema } from "./stop.schema";
import { stopDetailSchema } from "./stop.schema";

export const stopsResponseSchema = z
  .object({
    ok: z.literal(true),
    page: z.number(),
    data: stopsSchema,
    totalPages: z.number(),
    totalResults: z.number(),
  })
  .openapi("Stops Response Schema");

export const stopDetailResponseSchema = z
  .object({
    ok: z.literal(true),
    data: stopDetailSchema,
  })
  .openapi("Stops Detailed Response Schema");

export const StopParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '4009',
    description: 'Stop code',
  }),
}).openapi("Stops Params Schema")
