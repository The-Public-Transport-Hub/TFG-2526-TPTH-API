import { TramRepository } from "../../domain/ports/tram.repository";
import { TramsProvider } from "../../domain/ports/tram-provider.repository";

export async function syncTrams(
  tramsProvider: TramsProvider,
  tramsRepository: TramRepository,
) {
  const trams = await tramsProvider.getTrams();

  return tramsRepository.upsertTrams(trams);
}
