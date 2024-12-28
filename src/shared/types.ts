export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  last: number;
  first: number;
  items: number;
  pages: number;
  next: number | null;
  prev: number | null;
};
