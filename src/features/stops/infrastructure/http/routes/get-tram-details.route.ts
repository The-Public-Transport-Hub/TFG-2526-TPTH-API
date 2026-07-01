import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import {
  stopDetailResponseSchema,
  StopParamsSchema,
} from "../schemas/response.schema";
import { mongoStopsRepository } from "../../db/repositories/stop.repository";
import { getStopById } from "../../../aplication/use-case/get-stop-by-id.use-case";
import { metroStopsProvider } from "../../providers/metroTenerife/open-data/metro-connector";

const getTramStopDetailsRoute = new OpenAPIHono();

const findTramStopDetailsRoute = createRoute({
  method: "get",
  path: "/tram/{id}",
  tags: ["Trams"],
  summary: "Get tram stop details",
  request: {
    params: StopParamsSchema,
  },
  responses: {
    200: {
      description: "Get Stops Details",
      content: {
        "application/json": {
          schema: stopDetailResponseSchema,
        },
      },
    },
    404: {
      description: "ERROR stop not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    502: {
      description: "ERROR trying to read stops",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

getTramStopDetailsRoute.openapi(findTramStopDetailsRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");

    const stop = await getStopById(
      mongoStopsRepository,
      metroStopsProvider,
      id,
    );

    if (!stop) {
      return c.json(
        {
          ok: false as const,
          error: {
            code: "TRAM_STOP_NOT_FOUND",
            message: `Tram ${id} was not found`,
          },
        },
        404,
      );
    }

    return c.json(
      {
        ok: true as const,
        data: stop,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "TRAM_STOP_READ_ERROR",
          message: "Error reading stop detail",
        },
      },
      502,
    );
  }
});

export default getTramStopDetailsRoute;
