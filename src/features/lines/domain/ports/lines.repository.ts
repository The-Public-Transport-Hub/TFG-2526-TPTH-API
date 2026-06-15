import { Line } from "../models/line.model";
import { LineResponse } from "../models/line-response.model";
import { UpsertResult } from "../../../../shared/domain/result";
import { Page, PageRequest } from "../../../../shared/domain/pagination";

export interface LinesRepository {
  upsertLines(lines: Line[]): Promise<UpsertResult>;
  findLines(page: PageRequest): Promise<Page<LineResponse>>;
}
