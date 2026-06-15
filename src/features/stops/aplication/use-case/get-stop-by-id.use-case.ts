import { StopRepository } from "../../domain/ports/stop.repository";
import { StopsProvider } from "../../domain/ports/stops-provider.repository";
import { StopDetailResponse } from "../../domain/models/stop-response.model";

export async function getStopById(
  stopsRepository: StopRepository,
  stopsProvider: StopsProvider,
  id: string,
): Promise<StopDetailResponse | null> {
  const stop = await stopsRepository.findStopByCode(id);

  if (!stop) {
    return null
  }

  const arrivals = await stopsProvider.getStopDetails(id);

  return {
    id: stop.id,
    name: stop.name,
    latitude: stop.latitude,
    longitude: stop.longitude,
    lines: [],
    arrivals,
  }
}
