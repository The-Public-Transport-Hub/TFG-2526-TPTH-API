import { describe, expect, it } from "bun:test";
import { getTramById } from "../../src/features/trams/aplication/use-case/get-tram-by-id.use.case";
import { getTrams } from "../../src/features/trams/aplication/use-case/get-trams.use-case";
import { syncTrams } from "../../src/features/trams/aplication/use-case/sync-trams.use-case";
import { Tram } from "../../src/features/trams/domain/models/tram.model";
import { TramsProvider } from "../../src/features/trams/domain/ports/tram-provider.repository";
import { TramRepository } from "../../src/features/trams/domain/ports/tram.repository";

describe("trams use cases", () => {
  it("gets trams through the repository port", async () => {
    const trams = [{ id: "L1", name: "INTERCAMBIADOR - TRINIDAD" }];
    let receivedSearch: string | undefined;

    const repository: TramRepository = {
      upsertTrams: async () => ({ upserted: 0, modified: 0 }),
      findTrams: async (search) => {
        receivedSearch = search;
        return trams;
      },
      findTramById: async () => null,
    };

    const result = await getTrams(repository, "trinidad");

    expect(result).toEqual(trams);
    expect(receivedSearch).toBe("trinidad");
  });

  it("gets tram details using outbound as the default direction", async () => {
    const detail = {
      id: "L1",
      name: "INTERCAMBIADOR - TRINIDAD",
      direction: "outbound" as const,
      destination: "TRINIDAD",
      stops: [{ id: "INT", name: "INTERCAMBIADOR", order: 1 }],
    };

    let receivedDirection: "outbound" | "inbound" | undefined;

    const repository: TramRepository = {
      upsertTrams: async () => ({ upserted: 0, modified: 0 }),
      findTrams: async () => [],
      findTramById: async (_id, direction) => {
        receivedDirection = direction;
        return detail;
      },
    };

    const result = await getTramById(repository, "L1");

    expect(result).toEqual(detail);
    expect(receivedDirection).toBe("outbound");
  });

  it("gets tram details with the requested direction", async () => {
    let receivedDirection: "outbound" | "inbound" | undefined;

    const repository: TramRepository = {
      upsertTrams: async () => ({ upserted: 0, modified: 0 }),
      findTrams: async () => [],
      findTramById: async (_id, direction) => {
        receivedDirection = direction;
        return null;
      },
    };

    await getTramById(repository, "L1", "inbound");

    expect(receivedDirection).toBe("inbound");
  });

  it("syncs provider trams into the repository", async () => {
    const trams: Tram[] = [
      {
        number: "L1",
        name: "INTERCAMBIADOR - TRINIDAD",
        provider: "METROTENERIFE",
        directions: [],
        syncedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    let receivedTrams: Tram[] | undefined;

    const provider: TramsProvider = {
      getTrams: async () => trams,
    };

    const repository: TramRepository = {
      upsertTrams: async (trams) => {
        receivedTrams = trams;
        return { upserted: 1, modified: 0 };
      },
      findTrams: async () => [],
      findTramById: async () => null,
    };

    const result = await syncTrams(provider, repository);

    expect(result).toEqual({ upserted: 1, modified: 0 });
    expect(receivedTrams).toEqual(trams);
  });
});
