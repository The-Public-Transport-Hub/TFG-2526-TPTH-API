export type LineResponse = {
  id: string;
  name: string;
};

export type LineStopResponse = {
  id: string;
  name: string;
  order: number;
};

export type LineDirectionResponse = {
  direction: "outbound" | "inbound";
  destination: string;
  stops: LineStopResponse[];
};

export type LineDetailResponse = {
  id: string;
  name: string;
  directions: LineDirectionResponse[];
};
