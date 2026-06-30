import { Hono } from "hono";
import { syncLines } from "../../../../features/lines/aplication/use-case/sync-lines.use-case";
import { adminResponseSchema } from "../../schemas/admin-response.schema";
import { titsaLinesProvider } from "../../../../features/lines/infrastructure/providers/titsa/open-data/titsa.connector";
import { mongoLinesRepository } from "../../../../features/lines/infrastructure/db/repositories/lines.repository";

const linesAdminRoutes = new Hono();

let isSyncingLines = false;

linesAdminRoutes.post("/sync/lines", async (c) => {
  if (isSyncingLines) {
    return c.json(
      {
        ok: false as const,
        error: {
          code: "LINES_SYNC_ALREADY_RUNNING",
          message: "Lines sync is already running",
        },
      },
      409,
    );
  }

  isSyncingLines = true;

  syncLines(titsaLinesProvider, mongoLinesRepository)
    .catch(console.error)
    .finally(() => {
      isSyncingLines = false;
    });

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
