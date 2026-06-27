import { OpenAPIHono } from "@hono/zod-openapi";
import getTramsRoute from "./routes/get-trams.route";

const tramRoutes = new OpenAPIHono();

tramRoutes.route("/", getTramsRoute);

export default tramRoutes;
