import { StatusType } from './user-common.model';

export interface UserItem {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: StatusType;
  lastLogin: string;
}