import { ExternalLines, externalLinesSchema } from "./titsa.schema"
import { provider, linesOpenDataUrl, linesItineraryUrl } from "../config"
import { Line } from "../../../../domain/models/line.model"
import { LinesProvider } from "../../../../domain/ports/lines-provider.repository"

async function fetchProviderLines(): Promise<ExternalLines> {
  const response = await fetch(linesOpenDataUrl)

  if (!response.ok) {
    throw new Error(`Open Data error: ${response.status}`)
  }

  const data = await response.json()
  return externalLinesSchema.parse(data)
}

function convertProviderLines(providerLines: ExternalLines) : Line[] {
  const lines: Line[] =  providerLines.lineas.map((line) => ({
    number: line.linea_numero.toString(),
    name: line.linea_nombre,
    provider: provider,
    directions: [],
    syncedAt: new Date().toISOString(),
  }));

  return lines
}

export const titsaLinesProvider: LinesProvider = {
  async getLines() {
    const providerLines = await fetchProviderLines();
    return convertProviderLines(providerLines);
  }
}

// async function getLineItinerary(number: string, trajectory: '11' | '12') {
//   const params = new URLSearchParams({
//     c: '1234',
//     id_linea: number,
//     id_trayecto: trajectory,
//   })

//   const response = await fetch(`${linesItineraryUrl}?${params.toString()}`)

//   if (!response.ok) {
//     throw new Error(`TITSA itinerary error: ${response.status}`)
//   }

//   const data = await response.json()
//   const parsedData = externalLineItinerarySchema.parse(data)

//   if (!parsedData.success || !parsedData.paradas) {
//     return null
//   }

//   const lastStop = parsedData.paradas[parsedData.paradas.length - 1]
//   const destination = parsedData.paradas.find(stop => stop.tipo === 'destino')?.nombre
//     || lastStop?.nombre

//   const stops = parsedData.paradas.map(stop => ({
//     id: stop.codigo.toString(),
//     name: stop.nombre,
//   }))

//   return {
//     destination,
//     stops,
//   }
// }

// export async function getLineDetail(number: string) {
//   const [outbound, inbound] = await Promise.all([
//     getLineItinerary(number, '11'),
//     getLineItinerary(number, '12'),
//   ])

//   if (!outbound && !inbound) {
//     return null
//   }

//   const detail: Partial<LineDocument> = {
//     detailSyncedAt: new Date().toISOString(),
//   }

//   if (outbound) {
//     detail.destinationOutbound = outbound.destination
//     detail.stopsOutbound = outbound.stops
//   }

//   if (inbound) {
//     detail.destinationInbound = inbound.destination
//     detail.stopsInbound = inbound.stops
//   }

//   return detail
// }
