import { Hono } from "hono";
import { syncTrams } from "../../../../features/trams/aplication/use-case/sync-trams.use-case";
import { adminResponseSchema } from "../../schemas/admin-response.schema";
import { metroLinesProvider } from "../../../../features/trams/infrastructure/providers/metroTenerife/open-data/metro.connector";
import { mongoTramsRepository } from "../../../../features/trams/infrastructure/db/repositories/trams.repository";

const tramsAdminRoutes = new Hono();

tramsAdminRoutes.post("/sync/trams", async (c) => {
  syncTrams(metroLinesProvider, mongoTramsRepository).catch(console.error);

  const response = adminResponseSchema.parse({
    ok: true,
    data: {
      taskId: "sync-trams",
      status: "started",
    },
  });

  return c.json(response, 202);
});

export default tramsAdminRoutes;
