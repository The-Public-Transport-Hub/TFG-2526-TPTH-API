import { describe, expect, it } from "bun:test";
import { getStopById } from "../../src/features/stops/aplication/use-case/get-stop-by-id.use-case";
import { getStops } from "../../src/features/stops/aplication/use-case/get-stops-use-case";
import { syncStops } from "../../src/features/stops/aplication/use-case/sync-stops.use-case";
import { Stop } from "../../src/features/stops/domain/models/stop.model";
import { StopRepository } from "../../src/features/stops/domain/ports/stop.repository";
import { StopsProvider } from "../../src/features/stops/domain/ports/stops-provider.repository";
import { Request } from "../../src/shared/domain/models/request";

describe("stops use cases", () => {
  it("gets paginated stops through the repository port", async () => {
    const request: Request = {
      skip: 20,
      limit: 20,
      search: "orotava",
      provider: "TITSA",
    };

    const page = {
      items: [{ id: "4009", name: "ESTACION LA OROTAVA" }],
      total: 1,
    };

    let receivedRequest: Request | undefined;

    const repository: StopRepository = {
      upsertStops: async () => ({ upserted: 0, modified: 0 }),
      findStops: async (request) => {
        receivedRequest = request;
        return page;
      },
      findStopByCode: async () => null,
    };

    const result = await getStops(repository, request);

    expect(result).toEqual(page);
    expect(receivedRequest).toEqual(request);
  });

  it("combines stored stop details with provider arrivals", async () => {
    const storedStop = {
      id: "4009",
      name: "ESTACION LA OROTAVA",
      latitude: 28.3901,
      longitude: -16.5234,
      lines: [],
      arrivals: [],
    };

    const arrivals = [
      {
        lineId: "108",
        destination: "SANTA CRUZ",
        minutes: 8,
      },
    ];

    let receivedCode: string | undefined;

    const repository: StopRepository = {
      upsertStops: async () => ({ upserted: 0, modified: 0 }),
      findStops: async () => ({ items: [], total: 0 }),
      findStopByCode: async (code) => {
        receivedCode = code;
        return storedStop;
      },
    };

    const provider: StopsProvider = {
      getStops: async () => [],
      getStopDetails: async (code) => {
        receivedCode = code;
        return arrivals;
      },
    };

    const result = await getStopById(repository, provider, "4009");

    expect(result).toEqual({
      ...storedStop,
      arrivals,
    });
    expect(receivedCode).toBe("4009");
  });

  it("does not ask the provider for arrivals when the stop does not exist", async () => {
    let providerCalls = 0;

    const repository: StopRepository = {
      upsertStops: async () => ({ upserted: 0, modified: 0 }),
      findStops: async () => ({ items: [], total: 0 }),
      findStopByCode: async () => null,
    };

    const provider: StopsProvider = {
      getStops: async () => [],
      getStopDetails: async () => {
        providerCalls += 1;
        return [];
      },
    };

    const result = await getStopById(repository, provider, "UNKNOWN");

    expect(result).toBeNull();
    expect(providerCalls).toBe(0);
  });

  it("syncs provider stops into the repository", async () => {
    const stops: Stop[] = [
      {
        code: "4009",
        name: "ESTACION LA OROTAVA",
        latitude: 28.3901,
        longitude: -16.5234,
        provider: "TITSA",
        syncedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    let receivedStops: Stop[] | undefined;

    const provider: StopsProvider = {
      getStops: async () => stops,
      getStopDetails: async () => [],
    };

    const repository: StopRepository = {
      upsertStops: async (stops) => {
        receivedStops = stops;
        return { upserted: 1, modified: 0 };
      },
      findStops: async () => ({ items: [], total: 0 }),
      findStopByCode: async () => null,
    };

    const result = await syncStops(provider, repository);

    expect(result).toEqual({ upserted: 1, modified: 0 });
    expect(receivedStops).toEqual(stops);
  });
});
