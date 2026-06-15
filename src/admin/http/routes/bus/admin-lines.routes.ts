import { Hono } from "hono";
import { syncLines } from "../../../../features/lines/aplication/use-case/sync-lines.use-case";
// import { syncLineDetail } from "../../../../features/lines/aplication/use-case/sync-line-details.use-case";
// import { syncLineTimetables } from "../../../../features/lines/aplication/use-case/sync-line-timetables.use-case";
import { adminResponseSchema } from "../../schemas/admin-response.schema";
import { lineParamsSchema } from "../../schemas/admin-lines.schema";
import { getCurrentMonth } from "../../../../shared/utils/date";
import { titsaLinesProvider } from "../../../../features/lines/infrastructure/providers/titsa/open-data/titsa.connector";
import { mongoLinesRepository } from "../../../../features/lines/infrastructure/db/repositories/lines.repository";

const linesAdminRoutes = new Hono();

linesAdminRoutes.post("/sync/lines", async (c) => {
  syncLines(titsaLinesProvider, mongoLinesRepository).catch(console.error);

  const response = adminResponseSchema.parse({
    ok: true,
    data: {
      taskId: "sync-lines",
      status: "started",
    },
  });

  return c.json(response, 202);
});

// linesAdminRoutes.post("/sync/lines/:id", async (c) => {
//   const params = lineParamsSchema.parse(c.req.param());

//   syncLineDetail(params.id).catch(console.error);

//   const response = adminResponseSchema.parse({
//     ok: true,
//     data: {
//       taskId: `sync-lines-${params.id}`,
//       status: "started",
//     },
//   });

//   return c.json(response, 202);
// });

// linesAdminRoutes.post("sync/lines/:id/timetable", async (c) => {
//   const params = lineParamsSchema.parse(c.req.param());

//   syncLineTimetables(params.id, getCurrentMonth()).catch(console.error)

//   const response = adminResponseSchema.parse({
//     ok: true,
//     data: {
//       taskId: `sync-lines-${params.id}-timetable`,
//       status: "started",
//     },
//   });

//   return c.json(response, 202);
// });

export default linesAdminRoutes;
