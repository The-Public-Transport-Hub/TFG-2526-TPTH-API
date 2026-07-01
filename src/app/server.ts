import app from "./http/routes";
import { connectToDatabase } from "../shared/database/mongodb";
import { env } from "../shared/config/env";
import { syncLines } from "../features/lines/aplication/use-case/sync-lines.use-case";
import { syncStops } from "../features/stops/aplication/use-case/sync-stops.use-case";
import { titsaLinesProvider } from "../features/lines/infrastructure/providers/titsa/open-data/titsa.connector";
import { mongoLinesRepository } from "../features/lines/infrastructure/db/repositories/lines.repository";
import { titsaStopsProvider } from "../features/stops/infrastructure/providers/titsa/open-data/titsa.connector";
import { mongoStopsRepository } from "../features/stops/infrastructure/db/repositories/stop.repository";

const start = async () => {
  try {
    await connectToDatabase();

    Bun.serve({
      fetch: app.fetch,
      port: env.PORT,
    });

    if (env.ENABLE_CRON) {
      Bun.cron("0 0 1 * *", async () => {
        await syncLines(titsaLinesProvider, mongoLinesRepository);
        await syncStops(titsaStopsProvider, mongoStopsRepository);
      });
    }

    console.log(
      `Tu Guagua API is running on http://localhost:${env.PORT} (${env.BUN_ENV})`,
    );
  } catch (error) {
    console.error("Error initializing the server", error);
    process.exit(1);
  }
};

start();
