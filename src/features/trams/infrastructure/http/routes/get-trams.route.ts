import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import { tramResponseSchema } from "../schemas/response.schema";
import { mongoTramsRepository } from "../../db/repositories/trams.repository";
import { searchQuerySchema } from "../../../../../shared/http/schemas/query.schema";
import { getTrams } from "../../../aplication/use-case/get-trams.use-case";

const getTramsRoute = new OpenAPIHono();

const findTramsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Trams"],
  summary: "List tram lines",
  request: {
    query: searchQuerySchema.openapi({
      description: "Search trams by line or destination",
    }),
  },
  responses: {
    200: {
      description: "Get Trams",
      content: {
        "application/json": {
          schema: tramResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to read trams",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

getTramsRoute.openapi(findTramsRoute, async (c) => {
  try {
    const { q } = c.req.valid("query");

    const items = await getTrams(
      mongoTramsRepository,
      q
    );

    return c.json(
      {
        ok: true as const,
        data: items,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "GET_TRAMS_ERROR",
          message: "Error reading trams",
        },
      },
      502,
    );
  }
});

export default getTramsRoute;
