import { z } from "@hono/zod-openapi";

export const errorSchema = z
  .object({
    code: z.string().openapi({ example: "LINES_READ_ERROR" }),
    message: z.string().openapi({ example: "Error reading lines" }),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .openapi("Error");

export const errorResponseSchema = z
  .object({
    ok: z.literal(false),
    error: errorSchema,
  })
  .openapi("ErrorResponse");
