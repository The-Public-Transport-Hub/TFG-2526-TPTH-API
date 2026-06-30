import { linesOpenDataUrl, linesItineraryUrl} from "../config";
import {
  ExternalLines,
  ExternalLineItinerary,
  externalLinesSchema,
  externalLineItinerarySchema,
} from "./titsa.schema";

export async function fetchProviderLines(): Promise<ExternalLines> {
  const response = await fetch(linesOpenDataUrl);

  if (!response.ok) {
    throw new Error(`Open Data error: ${response.status}`);
  }

  const data = await response.json();

  return externalLinesSchema.parse(data);
}

export async function fetchLineItinerary(
  number: string,
  trajectory: "11" | "12",
): Promise<ExternalLineItinerary | null> {
  const params = new URLSearchParams({
    c: "1234",
    id_linea: number,
    id_trayecto: trajectory,
  });

  const response = await fetch(`${linesItineraryUrl}?${params.toString()}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const parsed = externalLineItinerarySchema.parse(data);

  if (!parsed.success || !parsed.paradas) {
    return null;
  }

  return parsed;
}
