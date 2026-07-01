import { describe, expect, it } from "bun:test";
import {
  externalLineItinerarySchema,
  externalLinesSchema,
} from "../../src/features/lines/infrastructure/providers/titsa/open-data/titsa.schema";
import {
  externalStopDetailSchema,
  externalStopsSchema,
} from "../../src/features/stops/infrastructure/providers/titsa/open-data/titsa.schema";
import {
  externalTramStopDetailSchema,
  externalTramStopsSchema,
} from "../../src/features/stops/infrastructure/providers/metroTenerife/open-data/metro.schema";
import {
  externalTramsLinesSchema,
  externalTramStopsSchema as externalTramLineStopsSchema,
} from "../../src/features/trams/infrastructure/providers/metroTenerife/open-data/metro.schema";

describe("external provider schemas", () => {
  it("validates TITSA open data lines", () => {
    const result = externalLinesSchema.safeParse({
      lineas: [
        {
          linea_numero: 10,
          linea_nombre: "SANTA CRUZ AEROPUERTO DEL SUR TFS",
          linea_url: "https://titsa.com/linea/10",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("validates TITSA line itineraries with nullable stops", () => {
    expect(
      externalLineItinerarySchema.safeParse({
        success: false,
        paradas: null,
      }).success,
    ).toBe(true);

    expect(
      externalLineItinerarySchema.safeParse({
        success: true,
        paradas: [{ codigo: 7571, nombre: "AEROPUERTO", tipo: "origen" }],
      }).success,
    ).toBe(true);
  });

  it("validates TITSA stops and stop arrivals", () => {
    expect(
      externalStopsSchema.safeParse({
        features: [
          {
            properties: {
              parada_id: 4009,
              parada_nombre: "ESTACION LA OROTAVA",
              latitud: 28.3901,
              longitud: -16.5234,
            },
          },
        ],
      }).success,
    ).toBe(true);

    expect(
      externalStopDetailSchema.safeParse({
        success: true,
        lineas: [{ id: "108", tiempo: "8", destino: "SANTA CRUZ" }],
      }).success,
    ).toBe(true);
  });

  it("validates Metro Tenerife tram stops and arrivals", () => {
    expect(
      externalTramStopsSchema.safeParse({
        type: "FeatureCollection",
        name: "Paradas de tranvia",
        features: [
          {
            type: "Feature",
            properties: {
              parada_id: 1,
              parada_nombre: "Intercambiador",
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
        ],
      }).success,
    ).toBe(true);

    expect(
      externalTramStopDetailSchema.safeParse([
        {
          service: "405",
          stop: "TRI",
          stopSAE: 133,
          destinationStop: "INT",
          stopDescription: "LA TRINIDAD",
          destinationStopDescription: "INTERCAMBIADOR",
          route: 1,
          direction: 2,
          lastUpdate: 1782648902000,
          lastUpdateFormatted: "28/06/2026 12:15:02",
          remainingMinutes: 20,
          orderStop: 1,
        },
      ]).success,
    ).toBe(true);
  });

  it("validates Metro Tenerife tram line geojson", () => {
    const result = externalTramsLinesSchema.safeParse({
      type: "FeatureCollection",
      name: "Lineas de tranvia",
      features: [
        {
          type: "Feature",
          properties: {
            linea_id: "L1",
            linea_nombre: "Linea 1",
            linea_descripcion: "Intercambiador - Trinidad",
            linea_parada_inicio: "Intercambiador",
            linea_parada_fin: "Trinidad",
          },
          geometry: {
            type: "LineString",
            coordinates: [[-16.25105038, 28.45893894]],
          },
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("keeps tram line stops compatible with the tram connector", () => {
    const result = externalTramLineStopsSchema.safeParse({
      type: "FeatureCollection",
      name: "Paradas de tranvia",
      features: [
        {
          type: "Feature",
          properties: {
            parada_id: 1,
            parada_nombre: "Intercambiador",
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
      ],
    });

    expect(result.success).toBe(true);
  });
});
