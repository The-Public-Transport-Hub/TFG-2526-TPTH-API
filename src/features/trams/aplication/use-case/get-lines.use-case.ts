import { PageRequest } from "../../../../shared/domain/pagination"
import { LinesRepository } from "../../domain/ports/lines.repository"

export async function getLines(linesRepository: LinesRepository, page: PageRequest) {
  return linesRepository.findLines(page)
}
