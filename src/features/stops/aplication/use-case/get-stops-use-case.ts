import { Request } from "../../../../shared/domain/models/request"
import { StopRepository } from "../../domain/ports/stop.repository"

export async function getStops(stopsRepository: StopRepository, page: Request) {
  return stopsRepository.findStops(page)
}
