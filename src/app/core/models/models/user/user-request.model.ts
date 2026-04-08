import { PaginationDto } from '../../_common/pagination.model'; // لو الـ pagination في ملف لوحده

export interface UserFilterDto {
  search?: string | null;
  role?: number | null;
  isActive?: boolean | null;
  pagination: PaginationDto;
}

export interface CreateUserDto {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  department?: string | null;
  role: number | null; 
  password: string;
}

export interface UpdateUserDto {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  department?: string | null;
  role: number;
  isActive: boolean;
}