export default interface GetAllDTO {
  filters?: any;
  order?: string;
  orderBy?: string;
  page?: number;
  all?: boolean;
  [key: string]: any;
}
