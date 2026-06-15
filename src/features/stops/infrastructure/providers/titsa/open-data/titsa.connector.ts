import {
  ExternalStops,
  ExternalStopDetail,
  externalStopsSchema,
  externalStopDetailSchema,
} from "./titsa.schema";
import { stopsOpenDataUrl, stopsTimesUrl } from "../config";
import { Stop } from "../../../../domain/models/stop.model";
import { StopsProvider } from "../../../../domain/ports/stops-provider.repository";
import { provider } from "../config";
import { StopArrival } from "../../../../domain/models/stop-response.model";

async function fetchProviderStops(): Promise<ExternalStops> {
  const response = await fetch(stopsOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data error: ${response.status}`);
  }

  const data = await response.json();

  return externalStopsSchema.parse(data);
}

function convertProviderStops(providerStops: ExternalStops): Stop[] {
  const stops: Stop[] = providerStops.features.map((feature) => ({
    code: feature.properties.parada_id.toString(),
    name: feature.properties.parada_nombre,
    latitude: feature.properties.latitud,
    longitude: feature.properties.longitud,
    provider: provider,
    syncedAt: new Date().toISOString(),
  }));

  return stops;
}

async function fetchProviderDetails(code: string): Promise<ExternalStopDetail> {
  const params = new URLSearchParams({
    id_parada: code,
  });

  const response = await fetch(`${stopsTimesUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`TITSA stop info error: ${response.status}`);
  }

  const data = await response.json();

  return externalStopDetailSchema.parse(data);
}

function convertProviderDetail(
  providerDetails: ExternalStopDetail,
): StopArrival[] {
  if (!providerDetails.success || !providerDetails.lineas) {
    return [];
  }

  const stopsDetails: StopArrival[] = providerDetails.lineas.map((lines) => ({
    lineId: lines.id,
    destination: lines.destino,
    minutes: Number(lines.tiempo),
  }));

  return stopsDetails;
}

export const titsaStopsProvider: StopsProvider = {
  async getStops() {
    const providerStops = await fetchProviderStops();
    return convertProviderStops(providerStops);
  },

  async getStopDetails(code) {
    const providerDetails = await fetchProviderDetails(code);
    return convertProviderDetail(providerDetails);
  },
};
