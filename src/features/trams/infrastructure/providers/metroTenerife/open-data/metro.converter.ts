import { Tram } from "../../../../domain/models/tram.model";
import { provider } from "../config";
import { ExternalTramsLines, ExternalTramStops } from "./metro.schema";

export function convertProviderLines(
  providerLines: ExternalTramsLines,
  providerStops: ExternalTramStops,
): Tram[] {
  const syncedAt = new Date().toISOString();

  const lineIds = [
    ...new Set(
      providerLines.features.map((feature) => feature.properties.linea_id),
    ),
  ];

  return lineIds.map((lineId) => {
    const features = providerLines.features.filter(
      (feature) => feature.properties.linea_id === lineId,
    );

    const firstFeature = features[0];

    return {
      number: firstFeature.properties.linea_id.trim().toUpperCase(),
      name: firstFeature.properties.linea_descripcion.trim().toUpperCase(),
      provider,
      syncedAt,
      directions: features.map((feature, index) => {
        const stops = buildDirectionStops(
          feature.geometry.coordinates,
          providerStops,
        );
        const orderedStops = index === 0 ? stops : [...stops].reverse();

        return {
          direction: index === 0 ? "outbound" : "inbound",
          destination: feature.properties.linea_parada_fin.trim().toUpperCase(),
          stops: orderedStops.map((stop, index) => ({
            ...stop,
            order: index + 1,
          })),
        };
      }),
    };
  });
}

function buildDirectionStops(
  coordinates: [number, number][],
  providerStops: ExternalTramStops,
) {
  const usedCodes = new Set<string>();

  return coordinates
    .map(([longitude, latitude]) =>
      providerStops.features.find((stop) => {
        const code = stop.properties.parada_url
          .split("#paneles/")[1]
          .trim()
          .toUpperCase();

        const isNear =
          Math.abs(stop.properties.parada_longitud - longitude) < 0.0015 &&
          Math.abs(stop.properties.parada_latitud - latitude) < 0.0015;

        if (!isNear || usedCodes.has(code)) {
          return false;
        }

        usedCodes.add(code);
        return true;
      }),
    )
    .filter((stop) => stop !== undefined)
    .map((stop, index) => ({
      code: stop.properties.parada_url
        .split("#paneles/")[1]
        .trim()
        .toUpperCase(),
      name: stop.properties.parada_nombre.trim().toUpperCase(),
      order: index + 1,
    }));
}
