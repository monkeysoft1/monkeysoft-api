export interface GetAllDTO {
  filters?: any;
  order?: string;
  orderBy?: string;
  page?: number;
  all?: boolean;
  [key: string]: any;
}

export interface GetAllOutputDTO<T> {
  list: T[];
  total: number;
  total_page: number;
}
