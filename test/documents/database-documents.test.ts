import { describe, expect, it } from "bun:test";
import { lineDocumentSchema } from "../../src/features/lines/infrastructure/db/schemas/line-document.schema";
import { stopDocumentSchema } from "../../src/features/stops/infrastructure/db/schemas/stop-document.schema";
import { tramDocumentSchema } from "../../src/features/trams/infrastructure/db/schemas/tram-document.schema";

describe("database document schemas", () => {
  it("validates stored line documents", () => {
    const result = lineDocumentSchema.safeParse({
      number: "10",
      name: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
      provider: "TITSA",
      directions: [
        {
          direction: "outbound",
          destination: "AEROPUERTO TENERIFE SUR",
          stops: [
            {
              code: "7571",
              name: "AEROPUERTO TENERIFE SUR",
              order: 1,
            },
          ],
        },
      ],
      syncedAt: "2026-07-01T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("defaults line directions to an empty array", () => {
    const document = lineDocumentSchema.parse({
      number: "10",
      name: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
      provider: "TITSA",
      syncedAt: "2026-07-01T00:00:00.000Z",
    });

    expect(document.directions).toEqual([]);
  });

  it("validates stored stop documents", () => {
    const result = stopDocumentSchema.safeParse({
      code: "4009",
      name: "ESTACION LA OROTAVA",
      latitude: 28.3901,
      longitude: -16.5234,
      provider: "TITSA",
      syncedAt: "2026-07-01T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects stop documents with invalid coordinates", () => {
    const result = stopDocumentSchema.safeParse({
      code: "4009",
      name: "ESTACION LA OROTAVA",
      latitude: "28.3901",
      longitude: -16.5234,
      provider: "TITSA",
      syncedAt: "2026-07-01T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });

  it("validates stored tram documents", () => {
    const result = tramDocumentSchema.safeParse({
      number: "L1",
      name: "INTERCAMBIADOR - TRINIDAD",
      provider: "Metro Tenerife",
      directions: [
        {
          direction: "outbound",
          destination: "TRINIDAD",
          stops: [
            {
              code: "INT",
              name: "INTERCAMBIADOR",
              order: 1,
            },
          ],
        },
      ],
      syncedAt: "2026-07-01T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid syncedAt values", () => {
    const result = tramDocumentSchema.safeParse({
      number: "L1",
      name: "INTERCAMBIADOR - TRINIDAD",
      provider: "Metro Tenerife",
      directions: [],
      syncedAt: "not-a-date",
    });

    expect(result.success).toBe(false);
  });
});
