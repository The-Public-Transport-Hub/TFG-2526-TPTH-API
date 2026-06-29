import { OpenAPIHono } from "@hono/zod-openapi";
import getStopsRoute from "./routes/get-stops.route";
import getDetailsRoute from "./routes/get-details.route";
import getTramStopDetailsRoute from "./routes/get-tram-details.route";

const stopRoutes = new OpenAPIHono();

stopRoutes.route("/", getStopsRoute);
stopRoutes.route("/", getDetailsRoute);
stopRoutes.route("/", getTramStopDetailsRoute)

export default stopRoutes;
