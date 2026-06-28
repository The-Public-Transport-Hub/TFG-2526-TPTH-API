import { TramsProvider } from "../../../../domain/ports/tram-provider.repository";
import {
  fetchProviderLines,
  fetchProviderStops,
} from "./metro.fetcher";
import { convertProviderLines } from "./metro.converter";

export const metroLinesProvider: TramsProvider = {
  async getTrams() {
    const providerLines = await fetchProviderLines();
    const providerStops = await fetchProviderStops();

    return convertProviderLines(providerLines, providerStops);
  },
};
