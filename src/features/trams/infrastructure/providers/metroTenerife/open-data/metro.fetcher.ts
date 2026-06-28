import {
  ExternalTramsLines,
  ExternalTramStops,
  externalTramsLinesSchema,
  externalTramStopsSchema,
} from "./metro.schema";
import {
  tramLinesOpenDataUrl,
  tramStopsOpenDataUrl,
} from "../config";

export async function fetchProviderLines(): Promise<ExternalTramsLines> {
  const response = await fetch(tramLinesOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data tram lines error: ${response.status}`);
  }

  const data = await response.json();

  return externalTramsLinesSchema.parse(data);
}

export async function fetchProviderStops(): Promise<ExternalTramStops> {
  const response = await fetch(tramStopsOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data tram stops error: ${response.status}`);
  }

  const data = await response.json();

  return externalTramStopsSchema.parse(data);
}
