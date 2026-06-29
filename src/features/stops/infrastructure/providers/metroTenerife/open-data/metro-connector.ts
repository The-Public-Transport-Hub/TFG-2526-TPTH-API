import {
  ExternalTramStops,
  externalTramStopsSchema,
  ExternalTramStopDetail,
  externalTramStopDetailSchema,
} from "./metro.schema";
import { provider, tramStopsOpenDataUrl, tramStopDetailsUrl } from "../config";
import { Stop } from "../../../../domain/models/stop.model";
import { StopsProvider } from "../../../../domain/ports/stops-provider.repository";
import { StopArrival } from "../../../../domain/models/stop-response.model";

async function fetchProviderTramStops(): Promise<ExternalTramStops> {
  const response = await fetch(tramStopsOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data error: ${response.status}`);
  }

  const data = await response.json();

  return externalTramStopsSchema.parse(data);
}

async function fetchProviderTramStopsDetails(
  code: string,
): Promise<ExternalTramStopDetail> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${tramStopDetailsUrl}/${code}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://tranviaonline.metrotenerife.com/",
        Origin: "https://tranviaonline.metrotenerife.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Metro Tenerife stop info error: ${response.status}`);
    }

    const data = await response.json();

    return externalTramStopDetailSchema.parse(data);
  } finally {
    clearTimeout(timeout);
  }
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

function convertProviderTramStopDetails(
  providerDetails: ExternalTramStopDetail,
): StopArrival[] {
  return providerDetails.map((arrival) => ({
    lineId: `L${arrival.route}`,
    destination: arrival.destinationStopDescription.trim().toUpperCase(),
    minutes: arrival.remainingMinutes,
  }));
}

export const metroStopsProvider: StopsProvider = {
  async getStops() {
    const providerStops = await fetchProviderTramStops();
    return convertProvierTramStops(providerStops);
  },

  async getStopDetails(code) {
    try {
      const providerDetails = await fetchProviderTramStopsDetails(code);
      return convertProviderTramStopDetails(providerDetails);
    } catch (error) {
      console.error("Metro Tenerife arrivals error", error);
      return [];
    }
  },
};
