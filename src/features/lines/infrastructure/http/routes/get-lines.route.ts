import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import { linesResponseSchema } from "../schemas/response.schema";
import { mongoLinesRepository } from "../../db/repositories/lines.repository";
import { paginationQuerySchema } from "../../../../../shared/http/schemas/pagination.schema";
import { PageRequest } from "../../../../../shared/domain/pagination";
import { getLines } from "../../../aplication/use-case/get-lines.use-case";

const getLinesRoute = new OpenAPIHono();

const findLinesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Lines"],
  request: {
    query: paginationQuerySchema.openapi({
      example: 1,
      description: "Page number for paginated results",
    }),
  },
  responses: {
    200: {
      description: "Get Lines",
      content: {
        "application/json": {
          schema: linesResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to read lines",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

getLinesRoute.openapi(findLinesRoute, async (c) => {
  try {
    const { page } = c.req.valid("query");
    const limit = 20;

    const pageRequest: PageRequest = {
      skip: (page - 1) * limit,
      limit: limit
    }

    const { items, total } = await getLines(
      mongoLinesRepository,
      pageRequest
    );

    const totalPages = Math.ceil(total / limit);

    return c.json(
      {
        ok: true as const,
        page: page,
        data: items,
        totalPages: totalPages,
        totalResults: total,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "GET_LINES_ERROR",
          message: "Error reading lines",
        },
      },
      502,
    );
  }
});

export default getLinesRoute;
