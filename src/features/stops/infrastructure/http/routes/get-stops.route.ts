import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import { stopsResponseSchema } from "../schemas/response.schema";
import { mongoStopsRepository } from "../../db/repositories/stop.repository";
import { querySchema } from "../../../../../shared/http/schemas/query.schema";
import { Request } from "../../../../../shared/domain/models/request";
import { getStops } from "../../../aplication/use-case/get-stops-use-case";
import { provider as titsaProvider } from "../../providers/titsa/config";
import { provider as metroProvider } from "../../providers/metroTenerife/config";

const getStopsRoute = new OpenAPIHono();

const findBusStopsRoute = createRoute({
  method: "get",
  path: "/bus",
  tags: ["Stops"],
  request: {
    query: querySchema.openapi({
      example: 1,
      description: "Page number for paginated results",
    }),
  },
  responses: {
    200: {
      description: "Get Bus Stops",
      content: {
        "application/json": {
          schema: stopsResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to read bus stops",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

const findTramStopsRoute = createRoute({
  method: "get",
  path: "/tram",
  tags: ["Trams"],
  request: {
    query: querySchema.openapi({
      example: 1,
      description: "Page number for paginated results",
    }),
  },
  responses: {
    200: {
      description: "Get Tram Stops",
      content: {
        "application/json": {
          schema: stopsResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to read tram stops",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

getStopsRoute.openapi(findBusStopsRoute, async (c) => {
  try {
    const { page, q } = c.req.valid("query");
    const limit = 20;

    const pageRequest: Request = {
      skip: (page - 1) * limit,
      limit: limit,
      search: q,
      provider: titsaProvider,
    };

    const { items, total } = await getStops(mongoStopsRepository, pageRequest);

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
          code: "GET_STOPS_ERROR",
          message: "Error reading stops",
        },
      },
      502,
    );
  }
});

getStopsRoute.openapi(findTramStopsRoute, async (c) => {
  try {
    const { page, q } = c.req.valid("query");
    const limit = 20;

    const pageRequest: Request = {
      skip: (page - 1) * limit,
      limit: limit,
      search: q,
      provider: metroProvider,
    };

    const { items, total } = await getStops(mongoStopsRepository, pageRequest);

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
          code: "GET_TRAM_STOPS_ERROR",
          message: "Error reading tram stops",
        },
      },
      502,
    );
  }
});

export default getStopsRoute;
