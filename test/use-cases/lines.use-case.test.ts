import { describe, expect, it } from "bun:test";
import { getLineById } from "../../src/features/lines/aplication/use-case/get-line-details.use-case";
import { getLines } from "../../src/features/lines/aplication/use-case/get-lines.use-case";
import { syncLines } from "../../src/features/lines/aplication/use-case/sync-lines.use-case";
import { Line } from "../../src/features/lines/domain/models/line.model";
import { LinesProvider } from "../../src/features/lines/domain/ports/lines-provider.repository";
import { LinesRepository } from "../../src/features/lines/domain/ports/lines.repository";
import { Request } from "../../src/shared/domain/models/request";

describe("lines use cases", () => {
  it("gets paginated lines through the repository port", async () => {
    const request: Request = {
      skip: 0,
      limit: 20,
      search: "10",
    };

    const page = {
      items: [{ id: "10", name: "SANTA CRUZ AEROPUERTO DEL SUR TFS" }],
      total: 1,
    };

    let receivedRequest: Request | undefined;

    const repository: LinesRepository = {
      upsertLines: async () => ({ upserted: 0, modified: 0 }),
      findLines: async (request) => {
        receivedRequest = request;
        return page;
      },
      findLineDetails: async () => null,
    };

    const result = await getLines(repository, request);

    expect(result).toEqual(page);
    expect(receivedRequest).toEqual(request);
  });

  it("gets line details through the repository port", async () => {
    const detail = {
      id: "10",
      name: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
      directions: [
        {
          direction: "outbound" as const,
          destination: "AEROPUERTO TENERIFE SUR",
          stops: [{ id: "7571", name: "AEROPUERTO TENERIFE SUR", order: 1 }],
        },
      ],
    };

    let receivedId: string | undefined;

    const repository: LinesRepository = {
      upsertLines: async () => ({ upserted: 0, modified: 0 }),
      findLines: async () => ({ items: [], total: 0 }),
      findLineDetails: async (id) => {
        receivedId = id;
        return detail;
      },
    };

    const result = await getLineById(repository, "10");

    expect(result).toEqual(detail);
    expect(receivedId).toBe("10");
  });

  it("syncs provider lines into the repository", async () => {
    const lines: Line[] = [
      {
        number: "10",
        name: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
        provider: "TITSA",
        directions: [],
        syncedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    let receivedLines: Line[] | undefined;

    const provider: LinesProvider = {
      getLines: async () => lines,
    };

    const repository: LinesRepository = {
      upsertLines: async (lines) => {
        receivedLines = lines;
        return { upserted: 1, modified: 0 };
      },
      findLines: async () => ({ items: [], total: 0 }),
      findLineDetails: async () => null,
    };

    const result = await syncLines(provider, repository);

    expect(result).toEqual({ upserted: 1, modified: 0 });
    expect(receivedLines).toEqual(lines);
  });
});
