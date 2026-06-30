import { Line, LineDirection } from "../models/line.model";
import { LineResponse } from "../models/line-response.model";
import { UpsertResult } from "../../../../shared/domain/models/result";
import { Page, Request } from "../../../../shared/domain/models/request";
import { LineDetailResponse } from "../models/line-response.model";

export interface LinesRepository {
  upsertLines(lines: Line[]): Promise<UpsertResult>;
  findLines(request: Request): Promise<Page<LineResponse>>;
  findLineDetails(number: string): Promise<LineDetailResponse | null>;
}
