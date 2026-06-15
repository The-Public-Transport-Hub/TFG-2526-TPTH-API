import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  lineDetailResponseSchema,
  linesResponseSchema,
} from "../schemas/response.schema";
import { errorResponseSchema } from "../../../../../shared/http/schemas/error.schema";
// import { obtainAllLines } from "../../aplication/use-case/get-lines.use-case";
// import { obtainLineById } from "../../aplication/use-case/get-line-by-id.use-case";
// import { obtainLineTimetable } from "../../aplication/use-case/get-line-timetable.use-case";
//import { paginationQuerySchema } from "../../../../shared/http/schemas/pagination.schema";

const linesOldRoutes = new OpenAPIHono();

const LineParamsSchema = z
  .object({
    id: z.string().openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "108",
      description: "Line number",
    }),
  })
  .openapi("Line Params Schema");

const LineDetailQuerySchema = z
  .object({
    direction: z
      .enum(["outbound", "inbound"])
      .default("outbound")
      .openapi({
        param: {
          name: "direction",
          in: "query",
        },
        example: "outbound",
        description: "Line direction to return",
      }),
  })
  .openapi("Line Detail Query Schema");

const LineTimetableQuerySchema = z
  .object({
    dayType: z
      .enum(["weekday", "saturday", "sunday_or_holiday"])
      .default("weekday")
      .openapi({
        param: {
          name: "dayType",
          in: "query",
        },
        example: "weekday",
        description: "Timetable day type to return",
      }),
    direction: z
      .enum(["outbound", "inbound"])
      .default("outbound")
      .openapi({
        param: {
          name: "direction",
          in: "query",
        },
        example: "outbound",
        description: "Line direction to return",
      }),
  })
  .openapi("Line Timetable Query Schema");

// const getLinesRoute = createRoute({
//   method: "get",
//   path: "/",
//   tags: ["Lines"],
//   summary: "Obtain a list of lines",
//   description: `Returns a paginated list of public transport lines stored in the database.
//   Data is synchronized from Open Data Tenerife through the admin sync endpoint and the scheduled cron job.`,
//   request: {
//     query: paginationQuerySchema.openapi({
//       example: 1,
//       description:
//         "Page number for paginated results (starting at 1) with a limit of 20",
//     }),
//   },
//   responses: {
//     200: {
//       description: "Lines list",
//       content: {
//         "application/json": {
//           schema: linesResponseSchema,
//         },
//       },
//     },
//     502: {
//       description: "Error trying to read lines",
//       content: {
//         "application/json": {
//           schema: errorResponseSchema,
//         },
//       },
//     },
//   },
// });

// const getLineRoute = createRoute({
//   method: "get",
//   path: "/{id}",
//   tags: ["Lines"],
//   summary: "Obtain a line detail",
//   description: `Returns the detail of a public transport line stored in the database.
//   The id parameter is the line number. By default it returns the outbound direction. Timetables are not included in this response.`,
//   request: {
//     params: LineParamsSchema,
//     query: LineDetailQuerySchema,
//   },
//   responses: {
//     200: {
//       description: "Line detail",
//       content: {
//         "application/json": {
//           schema: lineDetailResponseSchema,
//         },
//       },
//     },
//     404: {
//       description: "Line not found",
//       content: {
//         "application/json": {
//           schema: errorResponseSchema,
//         },
//       },
//     },
//     502: {
//       description: "Error trying to read line detail",
//       content: {
//         "application/json": {
//           schema: errorResponseSchema,
//         },
//       },
//     },
//   },
// });

// const getLineTimetableRoute = createRoute({
//   method: "get",
//   path: "/{id}/timetable",
//   tags: ["Lines"],
//   summary: "Obtain a line timetable",
//   description: `Returns the current month timetable pattern ready for the mobile app.
//   The response is grouped by origin and destination variants, with departure and arrival times.`,
//   request: {
//     params: LineParamsSchema,
//     query: LineTimetableQuerySchema,
//   },
//   responses: {
//     200: {
//       description: "Line timetable",
//       content: {
//         "application/json": {
//           schema: lineTimetableResponseSchema,
//         },
//       },
//     },
//     404: {
//       description: "Line not found",
//       content: {
//         "application/json": {
//           schema: errorResponseSchema,
//         },
//       },
//     },
//     502: {
//       description: "Error trying to read line timetable",
//       content: {
//         "application/json": {
//           schema: errorResponseSchema,
//         },
//       },
//     },
//   },
// });

// linesRoutes.openapi(getLinesRoute, async (c) => {
//   try {
//     const { page } = c.req.valid("query");
//     const limit = 20;

//     const { lines, total } = await obtainAllLines(page, limit);

//     const totalPages = Math.ceil(total / limit);

//     return c.json(
//       {
//         ok: true as const,
//         data: lines,
//         pagination: {
//           page: page,
//           limit: limit,
//           totalPages: totalPages,
//           totalResults: total,
//         },
//       },
//       200,
//     );
//   } catch (error) {
//     return c.json(
//       {
//         ok: false as const,
//         error: {
//           code: "LINES_READ_ERROR",
//           message: "Error reading lines",
//         },
//       },
//       502,
//     );
//   }
// });

// linesRoutes.openapi(getLineTimetableRoute, async (c) => {
//   try {
//     const { id } = c.req.valid("param");
//     const { dayType, direction } = c.req.valid("query");

//     const timetable = await obtainLineTimetable(
//       id,
//       getCurrentMonth(),
//       dayType,
//       direction,
//     );

//     if (!timetable) {
//       return c.json(
//         {
//           ok: false as const,
//           error: {
//             code: "LINE_TIMETABLE_NOT_FOUND",
//             message: `Timetable for line ${id} was not found. Synchronize it from the admin endpoint first`,
//           },
//         },
//         404,
//       );
//     }

//     return c.json(
//       {
//         ok: true as const,
//         data: timetable,
//       },
//       200,
//     );
//   } catch (error) {
//     return c.json(
//       {
//         ok: false as const,
//         error: {
//           code: "LINE_TIMETABLE_READ_ERROR",
//           message: "Error reading line timetable",
//         },
//       },
//       502,
//     );
//   }
// });

// linesRoutes.openapi(getLineRoute, async (c) => {
//   try {
//     const { id } = c.req.valid("param");
//     const { direction } = c.req.valid("query");

//     const line = await obtainLineById(id);

//     if (!line) {
//       return c.json(
//         {
//           ok: false as const,
//           error: {
//             code: "LINE_NOT_FOUND",
//             message: `Line ${id} was not found`,
//           },
//         },
//         404,
//       );
//     }

//     const destination =
//       direction === "outbound"
//         ? line.destinationOutbound
//         : line.destinationInbound;

//     const stops =
//       direction === "outbound"
//         ? (line.stopsOutbound ?? [])
//         : (line.stopsInbound ?? []);

//     return c.json(
//       {
//         ok: true as const,
//         data: {
//           number: line.number,
//           name: line.name,
//           provider: line.provider,
//           direction: direction,
//           destination: destination,
//           stops: stops,
//         },
//       },
//       200,
//     );
//   } catch (error) {
//     return c.json(
//       {
//         ok: false as const,
//         error: {
//           code: "LINE_READ_ERROR",
//           message: "Error reading line detail",
//         },
//       },
//       502,
//     );
//   }
// });

export default linesOldRoutes;
