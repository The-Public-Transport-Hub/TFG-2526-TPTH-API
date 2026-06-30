import { LinesRepository } from "../../domain/ports/lines.repository";

export async function getLineById(
  linesRepository: LinesRepository,
  id: string,
  direction: "outbound" | "inbound" = "outbound"
) {
  return linesRepository.findLineDetails(id)
}
