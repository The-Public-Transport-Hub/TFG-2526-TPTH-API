export type StopResponse = {
  id: string,
  name: string,
}

export type StopLine = {
  id: string,
  name: string,
}

export type StopArrival = {
  lineId: string,
  destination: string,
  minutes: number
}

export type StopDetailResponse = {
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  lines: StopLine[],
  arrivals: StopArrival[],
}
