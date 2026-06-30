export type Direction = "outbound" | "inbound"

export type LineStopRef = {
  code: string;
  name: string;
  order: number;
};

export type LineDirection = {
  direction: Direction,
  destination: string,
  stops: LineStopRef[],
}

export type Line = {
  number: string,
  name: string,
  provider: string,
  directions: LineDirection[],
  syncedAt: string,
}
