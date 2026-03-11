import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerToasterService } from './spinner-toaster.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private spinnerToasterService: SpinnerToasterService,
    private router: Router
  ) {}

  logout(): void {
    localStorage.clear();
    this.spinnerToasterService.showSpinner();
    this.spinnerToasterService.showToaster("success", "Logged out successfully");
    this.spinnerToasterService.hideSpinner();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getFullName(): string {
    return localStorage.getItem('fullName')!;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
