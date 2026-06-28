export type TramResponse = {
  id: string,
  name: string,
}

export type TramStopResponse = {
  id: string;
  name: string;
  order: number;
};

export type TramDetailResponse = {
  id: string;
  name: string;
  direction: "outbound" | "inbound";
  destination: string;
  stops: TramStopResponse[];
};
