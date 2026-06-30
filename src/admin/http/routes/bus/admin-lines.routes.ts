import { Hono } from "hono";
import { syncLines } from "../../../../features/lines/aplication/use-case/sync-lines.use-case";
import { adminResponseSchema } from "../../schemas/admin-response.schema";
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

export default linesAdminRoutes;
