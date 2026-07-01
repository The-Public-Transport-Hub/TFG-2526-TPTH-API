Bun.env.BUN_ENV = "test";
Bun.env.MONGO_URI = "mongodb://localhost:27017";
Bun.env.DB_NAME = "tuguagua-test";
Bun.env.ADMIN_API_KEY = "test-admin-token-with-more-than-32-chars";
Bun.env.ENABLE_CRON = "false";

import { describe, expect, it } from "bun:test";

describe("admin routes authentication", () => {
  it("rejects admin requests without a bearer token", async () => {
    const { default: adminRoutes } = await import("../../src/admin/admin");

    const response = await adminRoutes.request("/sync/lines", {
      method: "POST",
    });

    expect(response.status).toBe(401);
  });

  it("rejects admin requests with an invalid bearer token", async () => {
    const { default: adminRoutes } = await import("../../src/admin/admin");

    const response = await adminRoutes.request("/sync/lines", {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid-token",
      },
    });

    expect(response.status).toBe(401);
  });
});
