// src/app/http/doc.routes.ts
import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

export function registerDocs(app: OpenAPIHono) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "TPTH-The Public Transport Hub API",
      version: "1.0.0",
      description:
        "Public transport API. Aggregates data from multiple sources into a single normalized API",
      contact: {
        name: "By Eduardo Santander Restrepo",
      },
    },
    tags: [
      {
        name: "Lines",
        description: "Public transport lines.",
      },
      {
        name: "Stops",
        description: "Public transport stops.",
      },
      {
        name: "Trams",
        description: "Tram lines and tram stops.",
      },
      {
        name: "Health",
        description:
          "Operational endpoints used to check API and database availability.",
      },
    ],
  });

  app.get(
    "/reference",
    Scalar({
      theme: "purple",
      layout: "modern",
      defaultOpenAllTags: true,
      operationTitleSource: "summary",
      showSidebar: true,
      url: "/doc",
    }),
  );
}
