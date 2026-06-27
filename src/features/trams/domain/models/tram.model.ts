export type Direction = "outbound" | "inbound";

export type TramStopRef = {
  code: string;
  order: number;
};

export type TramDirection = {
  direction: Direction;
  destination: string;
  stops: TramStopRef[];
};

export type Tram = {
  number: string;
  name: string;
  provider: string;
  directions: TramDirection[];
  syncedAt: string;
};
