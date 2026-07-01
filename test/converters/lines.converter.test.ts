import { describe, expect, it } from "bun:test";
import {
  convertLineItinerary,
  convertProviderLinesWithoutDetails,
} from "../../src/features/lines/infrastructure/providers/titsa/open-data/titsa.converter";

describe("TITSA lines converters", () => {
  it("normalizes external line summaries into internal lines", () => {
    const lines = convertProviderLinesWithoutDetails({
      lineas: [
        {
          linea_numero: 10,
          linea_nombre: " Santa Cruz Aeropuerto del Sur TFS ",
          linea_url: "https://example.com/line/10",
        },
      ],
    });

    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({
      number: "10",
      name: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
      provider: "TITSA",
      directions: [],
    });
    expect(lines[0].syncedAt).toBeString();
  });

  it("normalizes a line itinerary into an ordered direction", () => {
    const direction = convertLineItinerary(
      {
        success: true,
        paradas: [
          { codigo: 7571, nombre: " Aeropuerto Tenerife Sur ", tipo: "origen" },
          { codigo: 7134, nombre: " San Isidro ", tipo: "parada" },
          { codigo: 9449, nombre: " Intercambiador Sta.Cruz ", tipo: "destino" },
        ],
      },
      "inbound",
    );

    expect(direction).toEqual({
      direction: "inbound",
      destination: "INTERCAMBIADOR STA.CRUZ",
      stops: [
        { code: "7571", name: "AEROPUERTO TENERIFE SUR", order: 1 },
        { code: "7134", name: "SAN ISIDRO", order: 2 },
        { code: "9449", name: "INTERCAMBIADOR STA.CRUZ", order: 3 },
      ],
    });
  });
});
