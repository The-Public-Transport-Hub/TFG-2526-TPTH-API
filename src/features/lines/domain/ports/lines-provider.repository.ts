import { Line } from "../models/line.model";

export interface LinesProvider {
  getLines(): Promise<Line[]>;
}
