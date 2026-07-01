import { z } from "@hono/zod-openapi";

export const paginationQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .min(1)
      .default(1)
      .openapi({
        param: {
          name: "page",
          in: "query",
        },
        example: "1",
      }),
  })
  .openapi("Pagination Query");
