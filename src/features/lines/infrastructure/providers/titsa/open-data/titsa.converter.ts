import { Line, LineDirection } from "../../../../domain/models/line.model";
import { provider } from "../config";
import { ExternalLines, ExternalLineItinerary } from "./titsa.schema";

export function convertProviderLinesWithoutDetails(
  providerLines: ExternalLines,
): Line[] {
  const syncedAt = new Date().toISOString();

  return providerLines.lineas.map((line) => ({
    number: line.linea_numero.toString(),
    name: line.linea_nombre.trim().toUpperCase(),
    provider,
    directions: [],
    syncedAt,
  }));
}

export function convertLineItinerary(
  itinerary: ExternalLineItinerary,
  direction: "outbound" | "inbound",
): LineDirection {
  const destination =
    itinerary.paradas?.find((stop) => stop.tipo === "destino")?.nombre ??
    itinerary.paradas?.at(-1)?.nombre ??
    "";

  return {
    direction,
    destination: destination.trim().toUpperCase(),
    stops: itinerary.paradas!.map((stop, index) => ({
      code: stop.codigo.toString(),
      name: stop.nombre.trim().toUpperCase(),
      order: index + 1,
    })),
  };
}
