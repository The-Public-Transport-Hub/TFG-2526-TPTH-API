import { OpenAPIHono } from "@hono/zod-openapi";
import getTramsRoute from "./routes/get-trams.route";
import getTramByIdRoute from "./routes/get-detail.route";

const tramRoutes = new OpenAPIHono();

tramRoutes.route("/", getTramsRoute);
tramRoutes.route("/", getTramByIdRoute)

export default tramRoutes;
