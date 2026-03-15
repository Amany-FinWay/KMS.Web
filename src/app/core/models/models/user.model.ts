export interface PaginationDto {
  pageNumber: number;
  pageSize: number;
}

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
  role: number;
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

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface UserStatisticsDto {
  totalUsers: number;
  activeUsers: number;
  administrators: number;
  inactiveUsers: number;
}

export interface RoleOptionDto {
  role: string;
  description: string;
  permissions: string[];
}

export interface UsersPageResponseDto {
  users: PagedResult<UserDto>;
  statistics: UserStatisticsDto;
  roles: RoleOptionDto[];
}

export interface StatusResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
}