import { Request } from "../../../../shared/domain/models/request"
import { LinesRepository } from "../../domain/ports/lines.repository"

export async function getLines(linesRepository: LinesRepository, page: Request) {
  return linesRepository.findLines(page)
}
