import { z } from "@hono/zod-openapi";

export const tramParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    example: "L1",
    description: "Tram line id",
  }),
});

export const tramDetailQuerySchema = z.object({
  direction: z
    .enum(["outbound", "inbound"])
    .default("outbound")
    .openapi({
      param: {
        name: "direction",
        in: "query",
      },
      example: "outbound",
    }),
});
