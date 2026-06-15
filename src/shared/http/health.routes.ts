import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { healthResponseSchema } from "./schemas/health.schema";
import { errorResponseSchema } from "./schemas/error.schema";
import { getDB } from "../database/mongodb";

const healthRoutes= new OpenAPIHono();

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Check API health",
  description:
    "Checks that the API is running and the database connection is available.",
  responses: {
    200: {
      description: "API is healthy",
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
    },
    503: {
      description: "API is not healthy",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

healthRoutes.openapi(healthRoute, async (c) => {
  try {
    await getDB().command({ ping: 1 });

    return c.json(
      {
        ok: true as const,
        data: {
          status: "healthy" as const,
          database: "connected" as const,
        },
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "HEALTH_ERROR",
          message: "Database connection is not available",
        },
      },
      503,
    );
  }
});

export default healthRoutes
