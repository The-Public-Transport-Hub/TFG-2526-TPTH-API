import { LineDirection } from "./line.model"

export type LineResponse = {
  id: string,
  name: string,
}

export type LineIDResponse = {
  number: string,
  name: string,
  directions: LineDirection[],
}
