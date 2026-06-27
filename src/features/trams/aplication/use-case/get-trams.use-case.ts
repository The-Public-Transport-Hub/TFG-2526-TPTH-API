import { TramRepository } from "../../domain/ports/tram.repository"

export async function getTrams(tramRepository: TramRepository, search?: string) {
  return tramRepository.findTrams(search);
}
