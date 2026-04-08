export interface StatusResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
}
