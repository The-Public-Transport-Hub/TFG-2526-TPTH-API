import { Hono } from "hono";
import { syncStops } from "../../../../features/stops/aplication/use-case/sync-stops.use-case";
import { titsaStopsProvider } from "../../../../features/stops/infrastructure/providers/titsa/open-data/titsa.connector";
import { mongoStopsRepository } from "../../../../features/stops/infrastructure/db/repositories/stop.repository";
import { adminResponseSchema } from "../../schemas/admin-response.schema";

const stopsAdminRoutes = new Hono();

stopsAdminRoutes.post("/sync/stops", async (c) => {
  syncStops(titsaStopsProvider, mongoStopsRepository).catch(console.error);

  const response = adminResponseSchema.parse({
    ok: true,
    data: {
      taskId: "sync-stops",
      status: "started",
    }
  });

  return c.json(response, 202);
});

export default stopsAdminRoutes;
