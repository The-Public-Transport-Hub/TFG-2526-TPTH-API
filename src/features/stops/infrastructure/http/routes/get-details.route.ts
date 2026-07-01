import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
import { stopDetailResponseSchema, StopParamsSchema } from "../schemas/response.schema";
import { mongoStopsRepository } from "../../db/repositories/stop.repository";
import { titsaStopsProvider } from "../../providers/titsa/open-data/titsa.connector";
import { getStopById } from "../../../aplication/use-case/get-stop-by-id.use-case";

const getDetailsRoute = new OpenAPIHono();

const findDetailsRoute = createRoute({
  method: "get",
  path: "/bus/{id}",
  tags: ["Stops"],
  summary: "Get bus stop details",
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

getDetailsRoute.openapi(findDetailsRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");

    const stop = await getStopById(mongoStopsRepository, titsaStopsProvider, id);

    if (!stop) {
      return c.json(
        {
          ok: false as const,
          error: {
            code: "STOP_NOT_FOUND",
            message: `Stop ${id} was not found`,
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
      200
)
  } catch (error) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "STOP_READ_ERROR",
          message: "Error reading stop detail",
        },
      },
      502,
    );
  }
});

export default getDetailsRoute;
