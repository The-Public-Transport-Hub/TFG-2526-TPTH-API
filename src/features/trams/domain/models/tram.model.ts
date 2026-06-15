export type Direction = "outbound" | "inbound"

export type tramStopRef = {
  code: string,
  order: number,
}

export type TramDirection = {
  direction: Direction,
  destination: string,
  stops: tramStopRef[],
}

export type Tram = {
  number: string,
  name: string,
  provider: string,
  directions: TramDirection[],
  syncedAt: string,
}
