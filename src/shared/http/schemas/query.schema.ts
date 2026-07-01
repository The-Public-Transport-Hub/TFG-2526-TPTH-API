import { z } from "@hono/zod-openapi";

export const paginationSchema = z
  .object({
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 20 }),
    totalPages: z.number().openapi({ example: 5 }),
    totalResults: z.number().openapi({ example: 100 }),
  })
  .openapi("Pagination");

export const querySchema = z
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
    q: z.string().trim().min(1).max(80).optional()      .openapi({
        param: {
          name: "q",
          in: "query",
        },
        example: "108",
      }),
  })
  .openapi("Query Params");

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(80).optional(),
});
