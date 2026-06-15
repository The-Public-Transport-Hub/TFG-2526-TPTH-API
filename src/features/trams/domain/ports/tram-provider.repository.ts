import { Tram } from "../models/tram.model";

export interface TramLinesProvider {
  getTramLines(): Promise<Tram[]>
}
