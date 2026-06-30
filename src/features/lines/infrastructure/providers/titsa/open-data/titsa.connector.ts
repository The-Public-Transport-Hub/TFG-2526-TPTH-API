import { LinesProvider } from "../../../../domain/ports/lines-provider.repository";
import { Line, LineDirection } from "../../../../domain/models/line.model";
import { lineDetailsRequestDelayMs } from "../config";
import { fetchLineItinerary, fetchProviderLines } from "./titsa.fetcher";
import {
  convertLineItinerary,
  convertProviderLinesWithoutDetails,
} from "./titsa.converter";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getLineDirections(number: string): Promise<LineDirection[]> {
  const directions: LineDirection[] = [];

  const outbound = await fetchLineItinerary(number, "11");

  if (outbound) {
    directions.push(convertLineItinerary(outbound, "outbound"));
  }

  await sleep(lineDetailsRequestDelayMs);

  const inbound = await fetchLineItinerary(number, "12");

  if (inbound) {
    directions.push(convertLineItinerary(inbound, "inbound"));
  }

  return directions;
}

async function addLineDetails(lines: Line[]): Promise<Line[]> {
  const detailedLines: Line[] = [];

  for (const [index, line] of lines.entries()) {
    console.log(
      `[lines-sync] ${index + 1}/${lines.length} line ${line.number}`,
    );

    const directions = await getLineDirections(line.number);

    detailedLines.push({
      ...line,
      directions,
    });

    await sleep(lineDetailsRequestDelayMs);
  }

  console.log(
    `[lines-sync] completed ${detailedLines.length}/${lines.length} lines`,
  );
  console.log("[lines-sync] sync finished successfully");

  return detailedLines;
}

export const titsaLinesProvider: LinesProvider = {
  async getLines() {
    const providerLines = await fetchProviderLines();
    const lines = convertProviderLinesWithoutDetails(providerLines).slice(0, 3);

    return addLineDetails(lines);
  },
};
