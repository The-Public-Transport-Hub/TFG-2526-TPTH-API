import { ExternalTramsLines, externalTramsLinesSchema } from "./metro.schema";
import { provider, tramLinesOpenDataUrl } from "../config";
import { Tram } from "../../../../domain/models/tram.model";
import { TramLinesProvider } from "../../../../domain/ports/tram-provider.repository";

async function fetchProviderLines(): Promise<ExternalTramsLines> {
  const response = await fetch(tramLinesOpenDataUrl)

  if (!response.ok) {
       throw new Error(`Open Data error: ${response.status}`)
  }

  const data = await response.json()

  return externalTramsLinesSchema.parse(data)
}

function convertProviderLines(providerLines: ExternalTramsLines): Tram[] {
  const tramLines: Tram[] = providerLines.features.map((feature) => ({
    number: feature.properties.linea_id,
    name: feature.properties.linea_nombre,
    provider: provider,
    directions: [],
    syncedAt: new Date().toISOString()
  }));

  return tramLines
}


export const metroLinesProvider: TramLinesProvider = {
  async getTramLines() {
    const providerLines = await fetchProviderLines();
    return convertProviderLines(providerLines);
  }
}
