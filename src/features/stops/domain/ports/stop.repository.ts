import { Stop } from "../models/stop.model";
import { UpsertResult } from "../../../../shared/domain/models/result";
import { Page, Request } from "../../../../shared/domain/models/request";
import { StopResponse, StopDetailResponse } from "../models/stop-response.model";

export interface StopRepository {
  upsertStops(stops: Stop[]): Promise<UpsertResult>;
  findStops(request: Request): Promise<Page<StopResponse>>;
  findStopByCode(code: string): Promise<StopDetailResponse | null>;
}
