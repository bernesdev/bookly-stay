export interface Page<T> {
  data: T[];
  meta: Meta;
}

export interface Meta {
  limit: number;
  itemCount: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface PageQuery {
  limit: number;
  cursor?: string;
}
