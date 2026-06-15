import { Stop } from "../models/stop.model";
import { StopArrival } from "../models/stop-response.model";

export interface StopsProvider {
  getStops(): Promise<Stop[]>
  getStopDetails(code: string): Promise<StopArrival[]>
}
