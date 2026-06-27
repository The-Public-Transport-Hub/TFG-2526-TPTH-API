import { z } from "zod";

export const paginationSchema = z
  .object({
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 20 }),
    totalPages: z.number().openapi({ example: 5 }),
    totalResults: z.number().openapi({ example: 100 }),
  })
  .openapi("Pagination");

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
