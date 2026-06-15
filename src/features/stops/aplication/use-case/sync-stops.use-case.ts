import { StopsProvider } from "../../domain/ports/stops-provider.repository"
import { StopRepository } from "../../domain/ports/stop.repository"

export async function syncStops(stopsProvider: StopsProvider, stopRepository: StopRepository) {
  const stops = await stopsProvider.getStops()

  return stopRepository.upsertStops(stops)
}
