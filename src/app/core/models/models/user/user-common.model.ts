export type StatusType = 'active' | 'inactive';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface StatusResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
}