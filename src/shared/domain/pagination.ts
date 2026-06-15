export type PageRequest = {
  skip: number;
  limit: number;
};

export type Page<T> = {
  items: T[];
  total: number;
};
