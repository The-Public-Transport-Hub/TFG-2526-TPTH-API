import { LinesProvider } from "../../domain/ports/lines-provider.repository"
import { LinesRepository } from "../../domain/ports/lines.repository"

export async function syncLines(linesProvider: LinesProvider, linesRepository: LinesRepository) {
  const lines = await linesProvider.getLines()

  return linesRepository.upsertLines(lines)
}
