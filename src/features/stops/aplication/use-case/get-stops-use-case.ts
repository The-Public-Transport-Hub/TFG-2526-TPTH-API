import { PageRequest } from "../../../../shared/domain/pagination"
import { StopRepository } from "../../domain/ports/stop.repository"

export async function getStops(stopsRepository: StopRepository, page: PageRequest) {
  return stopsRepository.findStops(page)
}
