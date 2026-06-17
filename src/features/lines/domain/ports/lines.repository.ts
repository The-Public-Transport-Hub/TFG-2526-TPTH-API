import { Line } from "../models/line.model";
import { LineResponse } from "../models/line-response.model";
import { UpsertResult } from "../../../../shared/domain/models/result";
import { Page, Request } from "../../../../shared/domain/models/request";

export interface LinesRepository {
  upsertLines(lines: Line[]): Promise<UpsertResult>;
  findLines(request: Request): Promise<Page<LineResponse>>;
}
