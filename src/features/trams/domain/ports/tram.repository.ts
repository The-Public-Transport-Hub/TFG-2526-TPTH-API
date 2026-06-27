import { Tram } from "../models/tram.model";
import { TramResponse } from "../models/tram-response.model";
import { UpsertResult } from "../../../../shared/domain/models/result";

export interface TramRepository {
  upsertTrams(trams: Tram[]): Promise<UpsertResult>;
  findTrams(search?: string): Promise<TramResponse[]>;
}
