import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import { lineParamsSchema } from "../schemas/params.schema";
import { lineDetailResponseSchema } from "../schemas/response.schema";
import { mongoLinesRepository } from "../../db/repositories/lines.repository";
import { getLineById } from "../../../aplication/use-case/get-line-details.use-case";

const getLineByIdRoute = new OpenAPIHono();

const findLineByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Lines"],
  summary: "Get bus line details",
  request: {
    params: lineParamsSchema,
  },
  responses: {
    200: {
      description: "Get a Line by ID",
      content: {
        "application/json": {
          schema: lineDetailResponseSchema,
        },
      },
    },
    404: {
      description: "ERROR line not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to find a line",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

getLineByIdRoute.openapi(findLineByIdRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");

    const line = await getLineById(mongoLinesRepository, id);

    if (!line) {
      return c.json(
        {
          ok: false as const,
          error: {
            code: "LINE_DETAILS_NOT_FOUND",
            message: `Line ${id} was not found`,
          },
        },
        404,
      );
    }

    return c.json(
      {
        ok: true as const,
        data: line,
      },
      200,
    );
  } catch {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "GET_LINE_ID_ERROR",
          message: "Error trying to find a line",
        },
      },
      502,
    );
  }
});

export default getLineByIdRoute;
