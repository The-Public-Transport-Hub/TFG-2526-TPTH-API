import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import {
  tramParamsSchema,
  tramDetailQuerySchema,
} from "../schemas/params.schema";
import { tramDetailResponseSchema } from "../schemas/response.schema";
import { mongoTramsRepository } from "../../db/repositories/trams.repository";
import { getTramById } from "../../../aplication/use-case/get-tram-by-id.use.case";

const getTramByIdRoute = new OpenAPIHono();

const findTramByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Trams"],
  request: {
    params: tramParamsSchema,
    query: tramDetailQuerySchema,
  },
  responses: {
    200: {
      description: "Get a Tram by ID",
      content: {
        "application/json": {
          schema: tramDetailResponseSchema,
        },
      },
    },
    404: {
      description: "ERROR tram not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to find a tram",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

getTramByIdRoute.openapi(findTramByIdRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const { direction } = c.req.valid("query");

    const tram = await getTramById(mongoTramsRepository, id, direction);

    if (!tram) {
      return c.json(
        {
          ok: false as const,
          error: {
            code: "TRAM_NOT_FOUND",
            message: `Tram ${id} was not found`,
          },
        },
        404,
      );
    }

    return c.json(
      {
        ok: true as const,
        data: tram,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "GET_TRAMS_ID_ERROR",
          message: "Error trying to find a tra",
        },
      },
      502,
    );
  }
});

export default getTramByIdRoute;
