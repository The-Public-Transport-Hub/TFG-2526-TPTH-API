import { Stop } from "../models/stop.model";
import { UpsertResult } from "../../../../shared/domain/result";
import { Page, PageRequest } from "../../../../shared/domain/pagination";
import { StopResponse, StopDetailResponse } from "../models/stop-response.model";

export interface StopRepository {
  upsertStops(stops: Stop[]): Promise<UpsertResult>;
  findStops(page: PageRequest): Promise<Page<StopResponse>>;
  findStopByCode(code: string): Promise<StopDetailResponse | null>;
}
