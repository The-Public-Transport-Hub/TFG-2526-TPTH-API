import { Tram } from "../models/tram.model";
import { TramResponse } from "../models/tram-response.model";
import { UpsertResult } from "../../../../shared/domain/models/result";

export interface TramRepository {
  upsertTrams(tram: Tram[]): Promise<UpsertResult>;
  findTrams(): Promise<TramResponse>;
}
