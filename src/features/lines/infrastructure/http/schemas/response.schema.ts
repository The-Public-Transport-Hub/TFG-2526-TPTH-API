import { z } from "@hono/zod-openapi";
import { linesSchema } from "./line.schema";
import { paginationSchema } from "../../../../../shared/http/schemas/pagination.schema";

// export const lineDetailResponseSchema = z
//   .object({
//     ok: z.literal(true),
//     data: lineDirectionDetailSchema,
//   })
//   .openapi("Line Detail Response Schema");

export const linesResponseSchema = z
  .object({
    ok: z.literal(true),
    page: z.number(),
    data: linesSchema,
    totalPages: z.number(),
    totalResults: z.number()
  })
  .openapi("Lines Response Schema");
