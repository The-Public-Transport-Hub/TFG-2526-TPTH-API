import { OpenAPIHono } from "@hono/zod-openapi";
import getLinesRoute from "./routes/get-lines.route";

const lineRoutes = new OpenAPIHono();

lineRoutes.route("/", getLinesRoute);

export default lineRoutes;
