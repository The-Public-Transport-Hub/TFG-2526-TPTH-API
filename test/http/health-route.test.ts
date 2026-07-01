Bun.env.BUN_ENV = "test";
Bun.env.MONGO_URI = "mongodb://localhost:27017";
Bun.env.DB_NAME = "tuguagua-test";
Bun.env.ADMIN_API_KEY = "test-admin-token-with-more-than-32-chars";
Bun.env.ENABLE_CRON = "false";

import { describe, expect, it } from "bun:test";

describe("health route", () => {
  it("returns service unavailable when the database has not been connected", async () => {
    const { default: healthRoutes } = await import("../../src/shared/http/health.routes");

    const response = await healthRoutes.request("/health");
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      ok: false,
      error: {
        code: "HEALTH_ERROR",
        message: "Database connection is not available",
      },
    });
  });
});
