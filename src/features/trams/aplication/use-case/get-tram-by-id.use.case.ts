import { TramRepository } from "../../domain/ports/tram.repository";

export async function getTramById(
  tramRepository: TramRepository,
  id: string,
  direction: "outbound" | "inbound" = "outbound",
) {
  return tramRepository.findTramById(id, direction);
}
