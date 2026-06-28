export type Request = {
  skip: number;
  limit: number;
  search?: string;
  provider?: string;
};

export type Page<T> = {
  items: T[];
  total: number;
};
