import { ExternalTramStops, externalTramStopsSchema } from "./metro.schema";
import { provider, tramStopsOpenDataUrl } from "../config";
import { Stop } from "../../../../domain/models/stop.model";
import { StopsProvider } from "../../../../domain/ports/stops-provider.repository";

async function fetchProviderTramStops(): Promise<ExternalTramStops> {
  const response = await fetch(tramStopsOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data error: ${response.status}`);
  }

  const data = await response.json();

  return externalTramStopsSchema.parse(data);
}

function convertProvierTramStops(providerStops: ExternalTramStops): Stop[] {
  const stops: Stop[] = providerStops.features.map((feature) => ({
    code: feature.properties.parada_url
      .split("#paneles/")[1]
      .trim()
      .toUpperCase(),
    name: feature.properties.parada_nombre.trim().toUpperCase(),
    latitude: feature.properties.parada_latitud,
    longitude: feature.properties.parada_longitud,
    provider: provider,
    syncedAt: new Date().toISOString(),
  }));

  return stops;
}

export const metroStopsProvider: StopsProvider = {
  async getStops() {
    const providerStops = await fetchProviderTramStops();
    return convertProvierTramStops(providerStops);
  },

  async getStopDetails() {
    return [];
  },
};
