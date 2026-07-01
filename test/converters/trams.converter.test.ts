import { describe, expect, it } from "bun:test";
import { convertProviderLines } from "../../src/features/trams/infrastructure/providers/metroTenerife/open-data/metro.converter";

describe("Metro Tenerife trams converters", () => {
  it("groups external tram directions into one internal tram", () => {
    const trams = convertProviderLines(
      {
        type: "FeatureCollection",
        name: "Lineas de tranvia",
        features: [
          {
            type: "Feature",
            properties: {
              linea_id: " l1 ",
              linea_nombre: "Linea 1",
              linea_descripcion: " Intercambiador - Trinidad ",
              linea_parada_inicio: "Intercambiador",
              linea_parada_fin: "Trinidad",
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [-16.25105038, 28.45893894],
                [-16.252, 28.459],
              ],
            },
          },
          {
            type: "Feature",
            properties: {
              linea_id: " l1 ",
              linea_nombre: "Linea 1",
              linea_descripcion: " Intercambiador - Trinidad ",
              linea_parada_inicio: "Trinidad",
              linea_parada_fin: "Intercambiador",
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [-16.252, 28.459],
                [-16.25105038, 28.45893894],
              ],
            },
          },
        ],
      },
      {
        type: "FeatureCollection",
        name: "Paradas de tranvia",
        features: [
          {
            type: "Feature",
            properties: {
              parada_id: 1,
              parada_nombre: " Intercambiador ",
              parada_descripcion: null,
              parada_latitud: 28.45893894,
              parada_longitud: -16.25105038,
              parada_url: "http://tranviaonline.metrotenerife.com/#paneles/INT",
            },
            geometry: {
              type: "Point",
              coordinates: [-16.25105038, 28.45893894],
            },
          },
          {
            type: "Feature",
            properties: {
              parada_id: 2,
              parada_nombre: " Trinidad ",
              parada_descripcion: null,
              parada_latitud: 28.459,
              parada_longitud: -16.252,
              parada_url: "http://tranviaonline.metrotenerife.com/#paneles/TRI",
            },
            geometry: {
              type: "Point",
              coordinates: [-16.252, 28.459],
            },
          },
        ],
      },
    );

    expect(trams).toHaveLength(1);
    expect(trams[0]).toMatchObject({
      number: "L1",
      name: "INTERCAMBIADOR - TRINIDAD",
      provider: "Metro Tenerife",
    });
    expect(trams[0].directions).toEqual([
      {
        direction: "outbound",
        destination: "TRINIDAD",
        stops: [
          { code: "INT", name: "INTERCAMBIADOR", order: 1 },
          { code: "TRI", name: "TRINIDAD", order: 2 },
        ],
      },
      {
        direction: "inbound",
        destination: "INTERCAMBIADOR",
        stops: [
          { code: "TRI", name: "TRINIDAD", order: 1 },
          { code: "INT", name: "INTERCAMBIADOR", order: 2 },
        ],
      },
    ]);
    expect(trams[0].syncedAt).toBeString();
  });
});
