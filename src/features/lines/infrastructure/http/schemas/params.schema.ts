import { z } from "@hono/zod-openapi";

export const lineParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    example: "108",
    description: "Bus line id",
  }),
});
