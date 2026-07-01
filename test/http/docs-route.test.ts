import { describe, expect, it } from "bun:test";
import { OpenAPIHono } from "@hono/zod-openapi";
import { registerDocs } from "../../src/app/http/doc.routes";

describe("documentation routes", () => {
  it("exposes the OpenAPI document", async () => {
    const app = new OpenAPIHono();
    registerDocs(app);

    const response = await app.request("/doc");
    const document = (await response.json()) as {
      openapi: string;
      info: {
        title: string;
      };
    };

    expect(response.status).toBe(200);
    expect(document.openapi).toBe("3.0.0");
    expect(document.info.title).toBe("TPTH-The Public Transport Hub API");
  });

  it("exposes the Scalar reference page", async () => {
    const app = new OpenAPIHono();
    registerDocs(app);

    const response = await app.request("/reference");
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("/doc");
  });
});
