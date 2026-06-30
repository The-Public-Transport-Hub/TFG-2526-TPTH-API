import { OpenAPIHono } from "@hono/zod-openapi";
import getLinesRoute from "./routes/get-lines.route";
import getLineByIdRoute from "./routes/get-details.route";

const lineRoutes = new OpenAPIHono();

lineRoutes.route("/", getLinesRoute);
lineRoutes.route("/", getLineByIdRoute);

export default lineRoutes;
