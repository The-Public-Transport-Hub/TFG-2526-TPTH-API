import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "../shared/config/env";
import linesAdminRoutes from "./http/routes/bus/admin-lines.routes";
import stopsAdminRoutes from "./http/routes/bus/admin-stops.routes";
import tramsAdminRoutes from "./http/routes/trams/admin-trams.routes";

const adminRoutes = new Hono();

adminRoutes.use("*", bearerAuth({ token: env.ADMIN_API_KEY }));

adminRoutes.route("/", linesAdminRoutes); // Guaguas
adminRoutes.route("/", stopsAdminRoutes); // Paradas de Guaguas
adminRoutes.route("/", tramsAdminRoutes); // Tranvias

export default adminRoutes;
