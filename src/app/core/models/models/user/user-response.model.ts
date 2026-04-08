import { PagedResult } from './user-common.model';

export interface UserDto {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  department?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface RoleOptionDto {
  role: string;
  description: string;
  permissions: string[];
}

export interface UserStatisticsDto {
  totalUsers: number;
  activeUsers: number;
  administrators: number;
  inactiveUsers: number;
}

export interface UsersPageResponseDto {
  users: PagedResult<UserDto>;
  statistics: UserStatisticsDto;
  roles: RoleOptionDto[];
}