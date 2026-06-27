import { ExternalTramsLines, externalTramsLinesSchema } from "./metro.schema";
import { provider, tramLinesOpenDataUrl } from "../config";
import { Tram } from "../../../../domain/models/tram.model";
import { TramsProvider } from "../../../../domain/ports/tram-provider.repository";

async function fetchProviderLines(): Promise<ExternalTramsLines> {
  const response = await fetch(tramLinesOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data error: ${response.status}`);
  }

  const data = await response.json();

  return externalTramsLinesSchema.parse(data);
}

function convertProviderLines(providerLines: ExternalTramsLines): Tram[] {
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
      number: firstFeature.properties.linea_id,
      name: firstFeature.properties.linea_descripcion.trim().toUpperCase(),
      provider,
      syncedAt,
      directions: features.map((feature, index) => ({
        direction: index === 0 ? "outbound" : "inbound",
        destination: feature.properties.linea_parada_fin.trim().toUpperCase(),
        stops: [],
      })),
    };
  });
}

export const metroLinesProvider: TramsProvider = {
  async getTrams() {
    const providerLines = await fetchProviderLines();
    return convertProviderLines(providerLines);
  },
};
