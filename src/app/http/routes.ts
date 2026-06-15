import { OpenAPIHono } from "@hono/zod-openapi";
import lineRoutes from "../../features/lines/infrastructure/http/line";
import stopRoutes from "../../features/stops/infrastructure/http/stop";
import adminRoutes from "../../admin/admin";
import healthRoutes from "../../shared/http/health.routes";
import { registerDocs } from "./doc.routes";

const app = new OpenAPIHono();

app.route("/lines", lineRoutes);
app.route("/stops", stopRoutes);
app.route("/admin", adminRoutes);
app.route("/", healthRoutes);
registerDocs(app);

export default app;
