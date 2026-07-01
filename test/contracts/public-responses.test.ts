import { describe, expect, it } from "bun:test";
import { errorResponseSchema } from "../../src/shared/http/schemas/error.schema";
import { healthResponseSchema } from "../../src/shared/http/schemas/health.schema";
import { linesResponseSchema, lineDetailResponseSchema } from "../../src/features/lines/infrastructure/http/schemas/response.schema";
import { stopsResponseSchema, stopDetailResponseSchema } from "../../src/features/stops/infrastructure/http/schemas/response.schema";
import { tramResponseSchema, tramDetailResponseSchema } from "../../src/features/trams/infrastructure/http/schemas/response.schema";

describe("public response contracts", () => {
  it("validates the paginated lines response", () => {
    const result = linesResponseSchema.safeParse({
      ok: true,
      page: 1,
      data: [{ id: "10", name: "SANTA CRUZ AEROPUERTO DEL SUR TFS" }],
      totalPages: 9,
      totalResults: 176,
    });

    expect(result.success).toBe(true);
  });

  it("validates the line details response", () => {
    const result = lineDetailResponseSchema.safeParse({
      ok: true,
      data: {
        id: "10",
        name: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
        directions: [
          {
            direction: "outbound",
            destination: "AEROPUERTO TENERIFE SUR",
            stops: [
              {
                id: "7571",
                name: "AEROPUERTO TENERIFE SUR",
                order: 1,
              },
            ],
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("validates the paginated stops response", () => {
    const result = stopsResponseSchema.safeParse({
      ok: true,
      page: 1,
      data: [{ id: "4009", name: "ESTACION LA OROTAVA" }],
      totalPages: 20,
      totalResults: 400,
    });

    expect(result.success).toBe(true);
  });

  it("validates the stop details response", () => {
    const result = stopDetailResponseSchema.safeParse({
      ok: true,
      data: {
        id: "4009",
        name: "ESTACION LA OROTAVA",
        latitude: 28.3901,
        longitude: -16.5234,
        lines: [{ id: "108", name: "SANTA CRUZ - LA OROTAVA" }],
        arrivals: [
          {
            lineId: "108",
            destination: "SANTA CRUZ",
            minutes: 8,
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("validates the trams response", () => {
    const result = tramResponseSchema.safeParse({
      ok: true,
      data: [{ id: "L1", name: "INTERCAMBIADOR - TRINIDAD" }],
    });

    expect(result.success).toBe(true);
  });

  it("validates the tram details response", () => {
    const result = tramDetailResponseSchema.safeParse({
      ok: true,
      data: {
        id: "L1",
        name: "INTERCAMBIADOR - TRINIDAD",
        direction: "outbound",
        destination: "TRINIDAD",
        stops: [{ id: "INT", name: "INTERCAMBIADOR", order: 1 }],
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects malformed success responses", () => {
    const result = linesResponseSchema.safeParse({
      ok: true,
      data: [{ id: "10", name: "SANTA CRUZ AEROPUERTO DEL SUR TFS" }],
    });

    expect(result.success).toBe(false);
  });

  it("validates shared error responses", () => {
    const result = errorResponseSchema.safeParse({
      ok: false,
      error: {
        code: "LINE_NOT_FOUND",
        message: "Line was not found",
      },
    });

    expect(result.success).toBe(true);
  });

  it("validates health responses", () => {
    const result = healthResponseSchema.safeParse({
      ok: true,
      data: {
        status: "healthy",
        database: "connected",
      },
    });

    expect(result.success).toBe(true);
  });
});
