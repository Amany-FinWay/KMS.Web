import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateUserDto,
  StatusResponse,
  UpdateUserDto,
  UserDto,
  UserFilterDto,
  UsersPageResponseDto
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/User`;

  getUsers(filter: UserFilterDto): Observable<StatusResponse<UsersPageResponseDto>> {
    return this.http.post<StatusResponse<UsersPageResponseDto>>(
      `${this.baseUrl}/list`,
      filter
    );
  }

  getUserById(id: number): Observable<StatusResponse<UserDto>> {
    return this.http.post<StatusResponse<UserDto>>(
      `${this.baseUrl}/get-by-id-${id}`,
      {}
    );
  }

  createUser(dto: CreateUserDto): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(
      `${this.baseUrl}/create`,
      dto
    );
  }

  updateUser(dto: UpdateUserDto): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(
      `${this.baseUrl}/update`,
      dto
    );
  }

  deleteUser(id: number): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(
      `${this.baseUrl}/delete-by-id-${id}`,
      {}
    );
  }
}